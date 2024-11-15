FROM node:16.20.2 AS building

COPY . /building
WORKDIR /building

RUN yarn config set ignore-engines true

RUN yarn

RUN yarn run docs:build

FROM nginx:1.27-alpine3.20

LABEL Author="rangh"
LABEL Application=magicWebEngine

COPY --from=building /building/docs-dist /usr/share/nginx/html
COPY --from=building /building/docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
