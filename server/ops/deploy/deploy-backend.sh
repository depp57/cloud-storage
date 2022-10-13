set -e

#printf "Stop existing backend...\n"

#source stop-backend.sh

printf "Pulling last backend version...\n"

docker pull registry.gitlab.com/sthommet/cloud-storage/client-ep

printf "Starting backend...\n"

container_id="$(docker run -d \
-v $ROOT_PATH/server/clientEndpoint/conf:/cloud-storage/conf \
-e MYSQL_CONF_PATH=/cloud-storage/conf/mysql.yaml \
-e SERVER_CONF_PATH=/cloud-storage/conf/server.yaml \
--network bridge \
-p 8008:8008 \
registry.gitlab.com/sthommet/cloud-storage/client-ep:latest)"

printf "Showing logs...\n"

docker logs -f "$container_id"
