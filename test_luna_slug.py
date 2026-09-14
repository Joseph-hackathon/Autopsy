import requests
import os
from dotenv import load_dotenv
load_dotenv('backend/.env')

HEADERS = {"X-CMC_PRO_API_KEY": os.getenv("CMC_API_KEY"), "Accepts": "application/json"}
res = requests.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/info", headers=HEADERS, params={"slug": "terra-luna"})
print(res.json().get('data', {}).keys())
