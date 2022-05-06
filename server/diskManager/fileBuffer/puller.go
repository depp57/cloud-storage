package fileBuffer

type Puller interface {
	Pull(uid string) error
}

func NewDefaultPuller() Puller {
	return &defaultPuller{}
}

type defaultPuller struct {
}

func (d *defaultPuller) Pull(uid string) error {
	return nil
}
