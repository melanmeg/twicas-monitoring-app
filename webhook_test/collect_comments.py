import time
import requests
import logging
import json
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright, Browser, Page

url = "http://x.x.x.x:3100/loki/api/v1/push"


def fetchComments(page: Page):
  html = page.content()
  soup = BeautifulSoup(html, "lxml")
  content_div = soup.select(
      '#comment-list-app > div.tw-comment-list-view.tw-player-page__comment__list > div.tw-comment-list-view__scroller')

  if not content_div:
    logging.info("List is empty.")
    return None
  name, id, comment, date = (
      content_div[0].find_all(class_="tw-comment-item-name"),
      content_div[0].find_all(class_="tw-comment-item-screen-id"),
      content_div[0].find_all(class_="tw-comment-item-comment"),
      content_div[0].find_all(class_="tw-comment-item-date"),
  )
  return name, id, comment, date


def postCommentToLoki(userId, name, id, comment, date):
  current_unix_time = int(round(time.time() * 10 ** 9))
  headers = {'Content-Type': 'application/json'}
  values = {
      "name": name[0].text,
      "id": id[0].text,
      "comment": comment[0].text,
      "date": date[0].text,
  }
  data = {
      "streams": [{
          "stream": {"twicas": userId + "/comments"},
          "values": [[str(current_unix_time), json.dumps(values)]],
      }]
  }
  json_data = json.dumps(data)
  requests.post(url, data=json_data, headers=headers)


def collectComments(playwright: sync_playwright, userId: str, flag=True):
  # https://playwright.dev/python/docs/emulation
  browser: Browser = playwright.chromium.launch(headless=True)
  context = browser.new_context(
      user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  )
  page = context.new_page()
  page.set_default_timeout(0)
  page.goto("https://twitcasting.tv/indexcaslogin.php")
  page.locator("#username").fill("meidokawae")
  page.locator("input[name=\"password\"]").fill(".YexLPKQ7-cwnAQ")
  page.goto("https://twitcasting.tv/" + userId)
  locator = page.locator(
      "#comment-list-app > div.tw-comment-list-view.tw-player-page__comment__list > div.tw-comment-list-view__scroller")
  locator.wait_for()

  oldId, oldComment = "", ""
  while flag == True:
    time.sleep(0.1)
    name, id, comment, date = fetchComments(page)
    if oldId != id[0].text or oldComment != comment[0].text:
      postCommentToLoki(userId, name, id, comment, date)
      oldId, oldComment = id[0].text, comment[0].text

  page.close()
  context.close()
  browser.close()
