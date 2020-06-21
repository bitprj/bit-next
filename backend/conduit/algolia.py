from algoliasearch.search_client import SearchClient
import os
from dotenv import load_dotenv
from pathlib import Path  # Python 3.6+ only

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

APPLICATION_ID = os.getenv('APPLICATION_ID')
ADMIN_API_KEY = os.getenv('ADMIN_API_KEY')

client = SearchClient.create(APPLICATION_ID, ADMIN_API_KEY)
articleIndex = client.init_index('dev_articles')
