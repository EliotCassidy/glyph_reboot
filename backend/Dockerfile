FROM node:16-alpine

WORKDIR /opt/glyph/backend

COPY package.json ./
# COPY yarn.lock ./
# COPY package-lock.json ./

RUN npm install -g nodemon
RUN npm install

COPY . ./

EXPOSE 5000

CMD [ "npm", "run", "dev" ]
