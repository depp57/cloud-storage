package services

import (
	"bytes"
	"errors"
	"gitlab.com/sthommet/cloud-storage/server/common/communications/files"
	"io"
	"sync"
	"time"
)

type FileBuffer interface {
	SaveFileMetadata(metadata files.FileMetadata) error
	SaveFragment(fragment files.FileFragment) error
	GetFragmentsReader(uploadID string) (io.ReadCloser, error)
}

var (
	ErrUnknownUpload           = errors.New("no upload buffer found for this fragment")
	ErrBufferClosed            = errors.New("file buffer has been closed for this upload")
	ErrFileAlreadyBeingWritten = errors.New("this file is already being written for this user")
)

type buffer struct {
	metadata  files.FileMetadata
	buffer    *bytes.Buffer
	bufCond   *sync.Cond
	startTime time.Time
}

type defaultFileBuffer struct {
	memory map[string]*buffer // matches uploadID with buffer
}

func NewDefaultFileBuffer(timeout time.Duration) FileBuffer {
	fb := &defaultFileBuffer{
		memory: make(map[string]*buffer),
	}
	fb.cleanMemory(timeout)
	return fb
}

func (b *defaultFileBuffer) SaveFileMetadata(metadata files.FileMetadata) error { //TODO always returns nil
	for _, pf := range b.memory { // PERFORMANCE : might be time-consuming if large number of file are being written
		if metadata.UserID == pf.metadata.UserID && metadata.Path == pf.metadata.Path && metadata.Filename == pf.metadata.Filename {
			return ErrFileAlreadyBeingWritten
		}
	}

	lock := &sync.Mutex{}
	b.memory[metadata.UploadID] = &buffer{
		metadata:  metadata,
		buffer:    &bytes.Buffer{},
		bufCond:   sync.NewCond(lock),
		startTime: time.Now(),
	}

	return nil
}

func (b *defaultFileBuffer) SaveFragment(fragment files.FileFragment) error {
	partialF, found := b.memory[fragment.UploadID]

	if !found {
		return ErrUnknownUpload
	}
	if partialF.buffer == nil {
		return ErrBufferClosed
	}

	_, err := partialF.buffer.Write(fragment.Data)
	if err != nil {
		return err //TODO wrap error
	}
	//recover() //TODO buffer.Write() panics with ErrTooLarge when "buffer becomes too large" (-> out of memory ?)

	partialF.bufCond.Broadcast()

	return nil
}

func (b *defaultFileBuffer) GetFragmentsReader(uploadID string) (io.ReadCloser, error) {
	partialFile, found := b.memory[uploadID]
	if !found {
		return nil, ErrUnknownUpload
	}

	return partialFile, nil
}

func (f *buffer) Read(p []byte) (n int, err error) {
	n, err = f.buffer.Read(p)
	if err == io.EOF {
		f.bufCond.L.Lock()
		f.bufCond.Wait()
		f.bufCond.L.Unlock()
		n, err = f.buffer.Read(p)
	}
	return
}

func (f *buffer) Close() error {
	*f = buffer{}
	return nil
}

func (b *defaultFileBuffer) cleanMemory(timeout time.Duration) {
	go func() {
		for _, pf := range b.memory {
			if *pf == (buffer{}) || pf.startTime.Add(timeout).After(time.Now()) {
				delete(b.memory, pf.metadata.UploadID) //TODO delete in loop ??
			}
		}
		time.Sleep(time.Second * 1)
	}()
}
