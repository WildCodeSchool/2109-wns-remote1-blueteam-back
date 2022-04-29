#Dockerfile back 😊
#1ere etape
FROM node:lts AS builderBack

WORKDIR /server

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY tsconfig.json ./
COPY prisma prisma
COPY src src

RUN yarn cache clean --mirror
RUN yarn build

#2eme etape
FROM node:lts AS installerBack

WORKDIR /server

COPY package.json .
COPY yarn.lock .

RUN yarn --production --frozen-lockfile
RUN rm -rf /usr/local/share/.cache/

COPY --from=builderBack /server/dist dist
COPY --from=builderBack /server/prisma prisma
COPY --from=builderBack /server/node_modules/.prisma node_modules/.prisma
CMD node dist/src/index


