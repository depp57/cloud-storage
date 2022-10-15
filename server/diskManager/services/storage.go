package services

import (
	"errors"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/dest"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files/fileFragment"
	"gitlab.com/sthommet/cloud-storage/server/common/log"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/httpClients"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/services/ports"
	"hash/crc32"
	"io"
	"time"
)

var (
	ErrStoringTimeout      = errors.New("timeout has reached out before storing completion")
	ErrNoSpaceLeftOnDevice = errors.New("disk is full !")
)

type Storage interface {
	LaunchStoring(clientEndpoint dest.Destination, metadata files.FileMetadata) error
	DeleteFile(userId string, fullpath string) error
}

type defaultStorage struct {
	fileBuffer  FileBuffer
	diskStorage ports.DiskPort
	db          ports.Database
	endpointClient httpClients.ClientEndpointClient

	storingTimeout time.Duration
}

func NewDefaultStorage(fileBuffer FileBuffer, diskStorage ports.DiskPort, db ports.Database, endpointClient httpClients.ClientEndpointClient, storingTimeout time.Duration) Storage {
	return &defaultStorage{
		fileBuffer:     fileBuffer,
		diskStorage:    diskStorage,
		db:             db,
		storingTimeout: storingTimeout,
		endpointClient: endpointClient,
	}
}

func (s *defaultStorage) LaunchStoring(clientEndpoint dest.Destination, metadata files.FileMetadata) error {
	if s.diskStorage.GetDiskLeftSpace() <= metadata.Size {
		return ErrNoSpaceLeftOnDevice
	}

	bufferReader, err := s.fileBuffer.GetFragmentsReader(metadata.UploadID)
	if err != nil {
		return err //TODO wrap err
	}
	storageWriter, err := s.diskStorage.GetFileWriter(metadata.UploadID)
	if err != nil {
		return err //TODO wrap err
	}

	go func() {
		defer bufferReader.Close()
		defer storageWriter.Close()

		err := s.copyAllFragments(metadata, bufferReader, storageWriter)
		if err != nil {
			//TODO handle error !!
			return
		}

		err = s.db.RegisterFile(metadata.UserID, metadata.Path+"/"+metadata.Filename, s.diskStorage.GetDiskName(), metadata.UploadID)
		if err != nil {
			//TODO handle error !!
			return
		}

		err = s.endpointClient.AcknowledgeWrittenFile(clientEndpoint, metadata)
		if err != nil {
			//TODO handle error !!
			return
		}
	}()

	return nil
	//TODO disk table in db : diskLeftSpace() ?
}

func (s *defaultStorage) copyAllFragments(metadata files.FileMetadata, reader io.ReadCloser, writer io.WriteCloser) error {
	var start = time.Now()
	var buf = make([]byte, fileFragment.FILE_FRAGMENT_DEFAULT_SIZE)
	var written uint32 = 0

	for {
		read, err := reader.Read(buf) // the Read() function of this buffer MUST be blocking when EOF
		if err != nil {
			return err
		}
		wrote, err := writer.Write(buf[:read])
		if err != nil {
			return err
		}

		written = written + uint32(wrote)

		if written >= metadata.Size { // case when file is complete
			writer.Close()
			fileCompleteReader, err := s.diskStorage.GetFileReader(metadata.UploadID)
			if err != nil {
				return err //TODO wrap error
			}

			if !checkFileCRC(metadata, fileCompleteReader) {
				return handleWrongCRC(metadata)
			}

			return nil
		}
		if time.Now().After(start.Add(s.storingTimeout)) { // timeout case
			return ErrStoringTimeout
		}
	}
}

func checkFileCRC(metadata files.FileMetadata, fileReader io.Reader) bool {
	data, err := io.ReadAll(fileReader) // CAUTION : entire file is charged in memory here
	if err != nil {
		return false
	}

	a := crc32.ChecksumIEEE(data) // CRC-32
	b := metadata.CRC

	return a == b
}

func handleWrongCRC(metadata files.FileMetadata) error {
	log.Warn("wrong CRC for file :" + metadata.Filename)
	return errors.New("wrong CRC")
}

func (s *defaultStorage) DeleteFile(userId string, fullpath string) error {
	fileID := s.db.GetFileId(userId, fullpath)

	err := s.db.UnRegisterFile(userId, fullpath)
	if err != nil {
		return err //TODO wrap error
	}

	err = s.diskStorage.RemoveFile(fileID)
	if err != nil {
		return err //TODO wrap error
	}

	return nil
	//TODO disk table in db : diskLeftSpace() ?
}
