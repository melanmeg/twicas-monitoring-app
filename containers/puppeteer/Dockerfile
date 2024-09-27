FROM ghcr.io/puppeteer/puppeteer:23.4.1

USER root
WORKDIR /app

COPY package.json package-lock.json ./
COPY ./src ./src
RUN chown -R pptruser:pptruser /app

USER pptruser
RUN npm i
