#!/bin/bash
docker run -d -p 80:80 -p 443:443 --restart=always registry.gitlab.com/sthommet/cloud-storage/web-client
echo "done! The wep app is running."
