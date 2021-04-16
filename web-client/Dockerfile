FROM node:16.14.2-alpine3.15 AS web-client
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY angular.json ngsw-config.json tsconfig.app.json tsconfig.json ./
COPY src ./src/
RUN npm run build

FROM nginx:alpine
COPY --from=web-client /app/dist/web-client /var/www/html
COPY /conf/nginx/iofactory.conf /etc/nginx/conf.d/iofactory.conf
COPY /conf/nginx/nginx.conf /etc/nginx/nginx.conf
COPY /conf/certificate /etc/nginx/certificate
EXPOSE 80 443
