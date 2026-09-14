import sys
import requests
sys.path.append('backend')
from cmc_api import CMCClient, HEADERS, BASE_URL

url = f"{BASE_URL}/v1/cryptocurrency/info"
res = requests.get(url, headers=HEADERS, params={"id": 8782})
print(res.json())
