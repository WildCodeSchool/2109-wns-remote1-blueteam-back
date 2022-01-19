#Dockerfile back 😊
FROM node:lts-alpine

WORKDIR /server
COPY package.json ./
RUN yarn install
COPY tsconfig.json tsconfig.json
COPY public public
COPY src src

CMD npm run dev