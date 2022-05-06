#!/bin/bash
cd web-client
git pull
ng build
rm -r /var/www/html/*
mv ./dist/web-client/* /var/www/html/

echo "done"