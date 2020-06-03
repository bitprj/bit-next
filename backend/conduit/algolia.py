from algoliasearch.search_client import SearchClient

client = SearchClient.create('ULTKUOSOMR', '46d33df53184cac090b85a305f2948a3')
articleIndex = client.init_index('articles')