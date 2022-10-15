package services

import (
	"bytes"
	"errors"
	"github.com/sventhommet/cloud-storage/server/common/communications/files"
	"hash/crc32"
	"time"
)

type FileBuffer interface {
	SaveMetadata(metadata files.FileMetadata) error
	SaveFragment(fragment files.FileFragment) error
}

type partialFile struct { //TODO package "entity" ?
	metadata  files.FileMetadata
	buffer    *bytes.Buffer
	startTime time.Time
}

type defaultFileBuffer struct {
	memory map[string]partialFile // map[uploadID]partialFile
}

func NewDefaultFileBuffer(timeout time.Duration) FileBuffer {
	fb := &defaultFileBuffer{}
	fb.cleanMemory(timeout)
	return fb
}

func (b *defaultFileBuffer) SaveMetadata(metadata files.FileMetadata) error { //TODO always returns nil
	b.memory[metadata.UploadID] = partialFile{
		metadata:  metadata,
		buffer:    &bytes.Buffer{},
		startTime: time.Now(),
	}

	return nil
}

func (b *defaultFileBuffer) SaveFragment(fragment files.FileFragment) error {
	partialF := b.memory[fragment.UploadID]

	_, err := partialF.buffer.Write(fragment.Data)
	if err != nil {
		return err
	} //TODO wrap error

	if partialF.buffer.Len() >= partialF.metadata.Size {
		if !checkFileCRC(partialF) {
			return errors.New("new file CRC is not valid")
		}

		//err = storeFile()
		if err != nil {
			return err //TODO wrap error
		}
	}

	return nil
}

func (b *defaultFileBuffer) cleanMemory(timeout time.Duration) {
	go func() {
		for _, pf := range b.memory {
			if pf.startTime.Add(timeout).After(time.Now()) {
				b.deleteTimeoutPartialFile(pf)
				delete(b.memory, pf.metadata.UploadID) //TODO delete in loop ??
			}
		}
		time.Sleep(time.Second * 1)
	}()
}

func (b *defaultFileBuffer) deleteTimeoutPartialFile(pf partialFile) {

}

func checkFileCRC(partialF partialFile) bool {
	return crc32.ChecksumIEEE(partialF.buffer.Bytes()) != partialF.metadata.CRC
}
