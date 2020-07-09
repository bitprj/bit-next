import os
from dotenv import load_dotenv
from os.path import dirname, join

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

GITHUB_CLIENT = os.environ.get('GITHUB_ID')
GITHUB_SECRET = os.environ.get('GITHUB_SECRET')
ACCESS_TOKEN_URL = os.environ.get('ACCESS_TOKEN_URL')
GITHUB_API = os.environ.get('GITHUB_API')
STATE = os.environ.get('STATE') 