FROM node:16.16-alpine3.15 AS web-client
WORKDIR /app
ARG path=/cloud-storage/web-client
COPY $path/package.json $path/package-lock.json ./
RUN npm ci
COPY $path/angular.json $path/ngsw-config.json $path/tsconfig.app.json $path/tsconfig.json ./
COPY $path/src ./src/
RUN npm run build

FROM nginx:alpine
COPY --from=web-client /app/dist/web-client /var/www/html
COPY /cloud-storage/web-client/conf/nginx/iofactory.conf /etc/nginx/conf.d/iofactory.conf
COPY /cloud-storage/web-client/conf/nginx/nginx.conf /etc/nginx/nginx.conf
COPY /certs /etc/nginx/certs
EXPOSE 80 443
