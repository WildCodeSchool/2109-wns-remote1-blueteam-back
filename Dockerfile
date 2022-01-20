#Dockerfile back 😊
FROM node:lts

WORKDIR /server
COPY package.json ./
COPY prisma ./prisma/

RUN yarn install
COPY tsconfig.json ./

COPY src src
CMD yarn run dev