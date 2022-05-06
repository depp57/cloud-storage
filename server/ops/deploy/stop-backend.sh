container_list="$(docker ps -a | grep registry.gitlab.com/sthommet/cloud-storage/client-ep | grep -v "Exited" | awk '{print $1}')"

for container in $container_list; do
  docker rm --force "$container"
done