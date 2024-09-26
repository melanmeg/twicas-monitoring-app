FROM ubuntu:noble

USER root
COPY playwright /playwright
WORKDIR /playwright

RUN apt-get update
RUN apt-get install -y curl python3
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH /root/.local/bin:$PATH

RUN poetry install --no-root
RUN poetry run playwright install
RUN poetry run playwright install-deps

# poetry run pytest test1.py

# FROM python:3.12-bookworm

# RUN pip install playwright==@1.47.0 && \
#   playwright install --with-deps
