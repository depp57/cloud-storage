## Docker-compose needs

### docker network

`docker network create --driver bridge cloud-storage`

### conf file tree on host

```
/cloud-storage
├── {service_name}
│   └── conf
│       ├── {conf_file_1}
│       ├── {conf_file_2}
│       └── ...
```