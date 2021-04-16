#!/bin/bash
docker run -d -p 80:80 -p 443:443 --restart=always web-client
echo "done! The wep app is running."
