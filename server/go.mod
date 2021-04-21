module github.com/sventhommet/cloud-storage/server

go 1.16

replace github.com/sventhommet/cloud-storage/server/utils => ./utils

replace github.com/sventhommet/cloud-storage/server/db => ./db

require (
	github.com/go-sql-driver/mysql v1.6.0
	golang.org/x/sys v0.0.0-20210403161142-5e06dd20ab57
	gopkg.in/yaml.v2 v2.4.0 // indirect
)
