set -e

if [ -z ${ROOT_PATH} ]; then
    echo "ROOT_PATH env var must be set"
    exit 1
fi

currentPath=$PWD
cd $ROOT_PATH # Must move to parent directory : we need root directory to be pushed to docker context

sudo docker build -t registry.gitlab.com/sthommet/cloud-storage/client-ep -f clientEndpoint/Dockerfile .
sudo docker push registry.gitlab.com/sthommet/cloud-storage/client-ep

cd $currentPath