ARG ALPINE_VERSION=3.20
ARG NODE_VERSION=20.17.0
ARG PUPPETEER_VERSION=23.4.1


FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS node

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
RUN npm i && npm ci

COPY ./src ./src
RUN npm run build


FROM ghcr.io/puppeteer/puppeteer:${PUPPETEER_VERSION} AS puppeteer

USER root
WORKDIR /app

COPY package.json package-lock.json ./
COPY --from=node /app/dist ./dist
RUN chown -R pptruser:pptruser /app

USER pptruser
RUN npm i

EXPOSE 18080

CMD ["npm", "run", "start"]
