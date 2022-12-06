FROM node:16.16-alpine3.15
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY angular.json ngsw-config.json tsconfig.app.json tsconfig.json ./
COPY src ./src
RUN npm run build