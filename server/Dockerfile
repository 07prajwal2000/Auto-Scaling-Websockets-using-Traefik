FROM node:18.12.1-alpine

WORKDIR /web-app
COPY ./index.html index.html
COPY ./index.js index.js
COPY ./package.json package.json

ENV NODE_ENV=production
RUN npm i

CMD [ "node", "/web-app/index.js" ]