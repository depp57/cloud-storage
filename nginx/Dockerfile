ARG WEB_CLIENT_TAG
FROM registry.gitlab.com/sthommet/cloud-storage/web-client:$WEB_CLIENT_TAG AS web-client

FROM nginx:alpine
COPY --from=web-client /app/dist/web-client /var/www/html
COPY conf/iofactory.conf /etc/nginx/conf.d/iofactory.conf
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY certs/* /etc/nginx/certs/
EXPOSE 80 443
