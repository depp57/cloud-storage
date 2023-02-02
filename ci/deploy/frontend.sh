docker rm --force nginx
docker image rm registry.gitlab.com/sthommet/cloud-storage/nginx:latest
docker run -d --name nginx -p 80:80 -p 443:443 --network cloud-storage registry.gitlab.com/sthommet/cloud-storage/nginx:latest