FROM node:18.2-alpine

WORKDIR /app

RUN apk add --update ffmpeg

COPY ./package.json ./package.json

RUN npm install