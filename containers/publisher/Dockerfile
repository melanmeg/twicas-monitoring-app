ARG ALPINE_VERSION=3.20
ARG NODE_VERSION=20.17.0


FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS node

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
RUN npm i && npm ci

COPY ./src ./src
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
