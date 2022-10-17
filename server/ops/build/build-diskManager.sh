set -e

if [ -z ${REPO_ROOT_PATH} ]; then
    echo "REPO_ROOT_PATH env var must be set"
    exit 1
fi

currentPath=$PWD
cd $REPO_ROOT_PATH/server # Must move to parent directory : we need server root directory to be pushed to docker context

docker build -t registry.gitlab.com/sthommet/cloud-storage/disk-manager -f diskManager/Dockerfile .
docker push registry.gitlab.com/sthommet/cloud-storage/disk-manager

cd $currentPath