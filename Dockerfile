FROM node:16.17.0 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm ci

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]
