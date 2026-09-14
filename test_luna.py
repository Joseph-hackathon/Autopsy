import sys
import requests
sys.path.append('backend')
from cmc_api import CMCClient, HEADERS, BASE_URL

res1 = requests.get(f"{BASE_URL}/v1/cryptocurrency/info", headers=HEADERS, params={"id": 4172})
res2 = requests.get(f"{BASE_URL}/v1/cryptocurrency/info", headers=HEADERS, params={"id": 20314})

print("4172:", res1.json().get('data', {}).get('4172', {}).get('name'))
print("20314:", res2.json().get('data', {}).get('20314', {}).get('name'))
