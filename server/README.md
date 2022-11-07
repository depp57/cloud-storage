# Run backend

### requirements

* docker
* docker compose extension (v3 or superior)

the first time you wish to run services locally, you first need to run 2 scripts once for all:

* `{CLOUD-STORAGE-REPO}/server/ops/deploy/create_network.sh`
* `{CLOUD-STORAGE-REPO}/server/ops/deploy/mysql/create_volume.sh`

you also need to create database tables using sql files located here `{CLOUD-STORAGE-REPO}/server/ops/deploy/mysql`

### services configuration

configuration files examples can be found here `{CLOUD-STORAGE-REPO}/server/conf`

by default, you need to have this directory tree :

```
/  
│
└───cloud-storage
│   |
|   └───conf
│   |   │   mysql.yaml
│   |   │   server.yaml
│   |
|   └───disk
|       │   disk-info.conf
```

disk-info.conf must only contain one string which is the default disk name.

### let's start Cloud-storage

you need to run 2 deployments using docker compose :

* Database `cd {CLOUD-STORAGE-REPO}/server/ops/deploy/mysql && docker compose up -d` 
* Cloud-storage services `cd {CLOUD-STORAGE-REPO}/server/ops/deploy && docker compose up -d`


# Swagger

start it running this command
`docker run -d -p 7000:8080 -e SWAGGER_JSON=/openapi/swagger.yaml -v {CLOUD-STORAGE-REPO}/server/doc:/openapi swaggerapi/swagger-ui`

then you can access it on `http://localhost:7000`
