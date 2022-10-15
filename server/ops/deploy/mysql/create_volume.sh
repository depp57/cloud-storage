mkdir /var/lib/mysql || true

docker volume create --driver local \
    --opt type=none \
    --opt device=/var/lib/mysql \
    --opt o=bind mysql-data-volume