import sqlite3
from typing import Optional, Tuple

import requests
from flask import Flask, abort, jsonify, redirect
from requests.models import Response

DB_FILE_PATH = "/root/work/volumes/flask/twicasdb.sqlite"

app = Flask(__name__)
app.config["DATABASE"] = DB_FILE_PATH
token = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"


def get_db():
    return sqlite3.connect(app.config["DATABASE"])


def req(userId: str, url: str, method: str) -> Response:
    headers = {
        "Accept": "application/json",
        "X-Api-Version": "2.0",
        "Authorization": "Basic {token}",
    }
    data = {"user_id": userId, "events": ["livestart", "liveend"]}
    if method == "GET":
        res = requests.get(url, headers=headers)
        return res
    elif method == "POST":
        res = requests.post(url, json=data, headers=headers)
        return res
    elif method == "DELETE":
        res = requests.delete(url, json=data, headers=headers)
        return res


def check_res_status(res: Response) -> Optional[None]:
    if res.status_code not in [200, 201, 202]:
        abort(res.status_code, "Unexpected StatusCode with {res.status_code}")


def add_check_userId(_userId: str) -> Optional[None]:
    db = get_db()
    curs = db.cursor()
    curs.execute("select * from users")
    res = curs.fetchall()
    for id, userId, username in res:
        if _userId == userId:
            abort(400, 'Already exist UserID with "{userId}"')


def delete_check_userId(_userId: str) -> Optional[None]:
    db = get_db()
    curs = db.cursor()
    curs.execute("select * from users")
    res = curs.fetchall()
    for id, userId, username in res:
        if _userId != userId:
            abort(400, 'Not exist UserID with "{userId}"')


def get_userinfo(res: Response) -> Tuple[str, str]:
    jsonData = res.json()
    realUserId: str = jsonData["user"]["id"]
    username: str = jsonData["user"]["name"]
    return realUserId, username


def setUser(userId: str, username: str) -> Response:
    db = get_db()
    curs = db.cursor()
    curs.execute("INSERT INTO users (userId, username) VALUES (?, ?)", (userId, username))
    db.commit()
    rows = curs.rowcount
    if rows > 0:
        return redirect("/")
    else:
        return jsonify(message="user not found."), 404


def unsetUser(userId: str, username: str) -> Response:
    db = get_db()
    curs = db.cursor()
    curs.execute("DELETE FROM users WHERE userId = ? OR username = ?", (userId, username))
    db.commit()
    rows = curs.rowcount
    if rows > 0:
        return redirect("/")
    else:
        return jsonify(message="user not found."), 404
