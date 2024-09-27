from flask import (
    g,
    request,
    render_template
)
from util import (
    app,
    get_userinfo,
    req,
    get_db,
    add_check_userId,
    delete_check_userId,
    check_res_status,
    setUser,
    unsetUser
)


@app.teardown_appcontext
def close_conn(e):
  db = g.pop('db', None)
  if db is not None:
    db.close()


@app.route('/')
def index():
  db = get_db()
  curs = db.cursor()
  curs.execute(
      'create table if not exists users('
      'id integer primary key autoincrement, userId string, username string)'
  )
  cursUsers = curs.execute('select * from users')
  result = cursUsers.fetchall()
  userdata = []
  for user in result:
    id, userId, username = user
    userdata.append({"userId": userId, "username": username})
  return render_template('index.html', userdata=userdata)


@app.route('/add', methods=['POST'])
def add():
  userId = request.form['add_userId']
  add_check_userId(userId)

  url = f'https://apiv2.twitcasting.tv/users/{userId}'
  res = req(userId, url, 'GET')
  check_res_status(res)
  realUserId, username = get_userinfo(res)

  url = 'https://apiv2.twitcasting.tv/webhooks'
  res = req(realUserId, url, 'POST')
  check_res_status(res)

  return setUser(userId, username)


@app.route('/delete', methods=['POST'])
def delete():
  userId = request.form['delete_userId']
  delete_check_userId(userId)

  url = f'https://apiv2.twitcasting.tv/users/{userId}'
  res = req(userId, url, 'GET')
  check_res_status(res)
  realUserId, username = get_userinfo(res)

  url = f'https://apiv2.twitcasting.tv/webhooks?user_id={userId}&events[]=livestart&events[]=liveend'
  res = req(realUserId, url, 'DELETE')
  check_res_status(res)

  return unsetUser(userId, username)


def main():
  app.debug = False
  app.run(host='0.0.0.0', port=80)


if __name__ == "__main__":
  main()
