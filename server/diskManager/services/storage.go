package services

import (
	"errors"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/dest"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
	"gitlab.com/sthommet/cloud-storage/server/common/log"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/httpClients"
	"gitlab.com/sthommet/cloud-storage/server/diskManager/services/ports"
	"hash/crc32"
	"io"
	"time"
)

const Crc32BufLength = 4096 * 1024

var (
	ErrStoringTimeout      = errors.New("timeout has reached out before storing completion")
	ErrNoSpaceLeftOnDevice = errors.New("disk is full !")
)

type Storage interface {
	LaunchStoring(clientEndpoint dest.Destination, metadata files.FileMetadata) error
	DeleteFile(userId string, fullpath string) error
}

type defaultStorage struct {
	fileBuffer     FileBuffer
	diskStorage    ports.DiskPort
	db             ports.Database
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
			log.Error("failed to run copying all fragments: " + err.Error())
			//TODO handle error !!
			return
		}

		err = s.db.RegisterFile(metadata.UserID, metadata.Path+"/"+metadata.Filename, s.diskStorage.GetDiskName(), metadata.UploadID)
		if err != nil {
			log.Error("failed to register new file into db: " + err.Error())
			//TODO handle error !!
			return
		}

		//TODO update disk SpaceLeft in a transaction

		err = s.endpointClient.AcknowledgeWrittenFile(clientEndpoint, metadata)
		if err != nil {
			log.Error("failed to acknowledge written file to ClientEndpoint: " + err.Error())
			//TODO handle error !!
			return
		}

		log.Info("File <" + metadata.Filename + "> for user <" + metadata.UserID + "> successfully written in DiskManager.")
	}()

	return nil
}

func (s *defaultStorage) copyAllFragments(metadata files.FileMetadata, reader io.ReadCloser, writer io.WriteCloser) error {
	var start = time.Now()
	var buf = make([]byte, metadata.ChunkSize)
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
		//log.Debug("wrote so far: " + strconv.Itoa(int(written))) TODO remove ?

		if written >= metadata.Size { // case when file is complete
			writer.Close() // close the file writer to be able to open a reader on it
			fileCompleteReader, err := s.diskStorage.GetFileReader(metadata.UploadID)
			if err != nil {
				return err //TODO wrap error
			}

			if !checkFileCRC(metadata, fileCompleteReader) {
				return handleWrongCRC(metadata)
			}

			return nil
		}

		if time.Now().After(start.Add(s.storingTimeout)) { // TODO not the good place : line 97 is blocking
			return ErrStoringTimeout
		}
	}
}

func checkFileCRC(metadata files.FileMetadata, fileReader io.Reader) bool {
	var buf = make([]byte, Crc32BufLength)
	var prevCrc uint32 = 0

	for offset := uint32(0); offset < metadata.Size; offset += Crc32BufLength {
		n, err := fileReader.Read(buf)
		if err != nil {
			//TODO handle async error
			return false
		}

		prevCrcByteSlice := uint32ToByteSlice(prevCrc)
		dataCrcByteSlice := uint32ToByteSlice(crc32.ChecksumIEEE(buf[0:n]))
		merge := append(prevCrcByteSlice, dataCrcByteSlice...)
		prevCrc = crc32.ChecksumIEEE(merge)

		//log.Debug("intermediate CRC :" + strconv.Itoa(int(prevCrc))) TODO remove ?
	}

	return prevCrc == metadata.CRC
}

func uint32ToByteSlice(val uint32) []byte {
	var res = [4]byte{
		byte((val & (255 * 256 * 256 * 256)) >> 24),
		byte((val & (255 * 256 * 256)) >> 16),
		byte((val & (255 * 256)) >> 8),
		byte(val & 255),
	}

	return res[:]
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

//= dowload (ficher.marinou)==1 if fichier.marinou = "Comptabilité Marine 2023"
//= replace (fichier.marinou)==0 if fichier.marinou = "str[]"
