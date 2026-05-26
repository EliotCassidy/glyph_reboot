FROM node:16-alpine

WORKDIR /opt/glyph/frontend

# Install dependencies first for better caching
COPY package.json ./

RUN apk add --no-cache python3 make g++ && \
	npm install --legacy-peer-deps --no-audit --no-fund

COPY . ./

EXPOSE 3000

CMD [ "yarn", "start" ]
