# -*- coding:utf-8 -*-
from typing import Any, Dict, List
import json
import logging
from multiprocessing import Process
from playwright.sync_api import sync_playwright
from collect_comments import collectComments

process: Process = None
processes: List[Process] = []


def getElement(req_body: str, key: str) -> str:
  json_data: Dict[str, Any] = json.loads(req_body)
  data: str = json_data.get(key, '')
  return data


def backgroundTask(user_id: str):
  with sync_playwright() as playwright:
    collectComments(playwright, user_id)


def liveStart(user_id: str):
  logging.info("%s: Live Start" % user_id)
  process = Process(target=backgroundTask, args=(user_id,))
  process.name = f"Process-{user_id}"
  processes.append(process)
  process.start()
  logging.info("%s: Background Process Start" % user_id)


def liveEnd(user_id: str):
  logging.info("%s: Live End" % user_id)
  for process in processes:
    if process.name == f"Process-{user_id}":
      process.terminate()
      logging.info("%s: Background Process Terminate" % user_id)
