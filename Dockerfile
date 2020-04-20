FROM node:10-alpine

RUN apk add --no-cache make gcc g++ python bash libc6-compat
RUN npm config set unsafe-perm true
RUN npm i -g pm2

# Create app directory
RUN mkdir -p /app

COPY . /app
COPY bin/www.js /app/app.js

WORKDIR /app

##change npm registry
#RUN npm config set registry https://registry.npm.taobao.org

# Bundle app source

COPY ops/pm2.json pm2.json

ENV NPM_CONFIG_LOGLEVEL info
#RUN npm install --production
RUN yarn install --production

EXPOSE 8192

CMD [ "pm2-docker", "start", "pm2.json" ]
