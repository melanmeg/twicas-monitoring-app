FROM mcr.microsoft.com/playwright:v1.47.2-noble

RUN npx -y playwright@1.47.2 install --with-deps

USER root
COPY playwright /playwright
WORKDIR /playwright
