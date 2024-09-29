import os


class Config:
    HOST = os.environ.get("FLASK_RUN_HOST") or "0.0.0.0"
    PORT = os.environ.get("FLASK_RUN_PORT") or 5000
