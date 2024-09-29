FROM python:3.10-bookworm

RUN apt-get update && apt-get install -y \
  curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN pip install --upgrade pip
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY src .
COPY templates ./templates

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
