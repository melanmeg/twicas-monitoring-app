# -*- coding:utf-8 -*-
import http.server
import socketserver
from util import getElement, liveStart, liveEnd
import logging

port_num = 18080
LOG_DIR = '/root/work/log/'

logging.basicConfig(filename=LOG_DIR + 'webhook.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')


class MyHandler(http.server.BaseHTTPRequestHandler):
  def do_POST(self):
    content_length = int(self.headers['content-length'])
    req_body = self.rfile.read(content_length).decode("utf-8")
    logging.info('| ---------------------------- |')
    logging.info('| ---------------------------- |')
    logging.info('| ----- WebhookIncoming! ----- |')
    logging.info('| -------- twicasting -------- |')
    logging.info('| ---------------------------- |')
    logging.info('| ------- Incoming Data ------ |')
    logging.info(req_body)
    logging.info('| ---------------------------- |')

    event = getElement(req_body, 'event')
    user_id = getElement(req_body, 'broadcaster')['screen_id']
    if event == "livestart":
      liveStart(user_id)
    elif event == "liveend":
      liveEnd(user_id)
    else:
      logging.error('Failed!!!')

    self.send_response(200)
    self.send_header('Content-Type', 'text/plain; charset=utf-8')
    self.end_headers()


with socketserver.TCPServer(("", port_num), MyHandler) as httpd:
  httpd.serve_forever()
