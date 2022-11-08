# Run backend

### requirements

* docker
* docker compose extension v3 or superior
* ansible v2.13 or superior

```
cd {cloud-storage-repo}/server/ops/ansible
ansible-playbook install-requirements.yml -i inventory.yaml
```

### let's start Cloud-storage

Deploy database
```
cd {cloud-storage-repo}/server/ops/ansible
ansible-playbook init-mysql.yml -i inventory.yaml --extra-vars "repo_root_path={cloud-storage-repo} mysql_username={mysql-username} mysql_password={mysql-password}"
```

Build and deploy services
```
cd {cloud-storage-repo}/server/ops/ansible
ansible-playbook build-and-deploy.yml -i inventory.yaml --extra-vars "repo_root_path={cloud-storage-repo} mysql_username={mysql-username} mysql_password={mysql-password} disk_name={disk-name}"
```

### services configuration

directory tree :

```
/cloud-storage
├── clientEndpoint
│   └── conf
│       ├── mysql.yaml
│       └── server.yaml
└── diskManager
    ├── conf
    │   └── mysql.yaml
    └── disk
        ├── data
        ├── disk-info.conf
        └── files
```

disk-info.conf must only contain one string which is the default disk name.

# Swagger

start it running this command
`docker run -d -p 7000:8080 -e SWAGGER_JSON=/openapi/swagger.yaml -v {cloud-storage-repo}/server/doc:/openapi swaggerapi/swagger-ui`

then you can access it on `http://localhost:7000`
