docker build -t registry.gitlab.com/sthommet/cloud-storage/nginx:latest --build-arg WEB_CLIENT_TAG=latest $REPO_PATH/nginx
docker push registry.gitlab.com/sthommet/cloud-storage/nginx:latest