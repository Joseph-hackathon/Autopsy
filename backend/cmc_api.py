import os
import requests
from dotenv import load_dotenv

load_dotenv()

CMC_API_KEY = os.getenv("CMC_API_KEY")
BASE_URL = "https://pro-api.coinmarketcap.com"

HEADERS = {
    "Accepts": "application/json",
    "X-CMC_PRO_API_KEY": CMC_API_KEY,
}

class CMCClient:
    @staticmethod
    def get_info(query: str):
        url = f"{BASE_URL}/v1/cryptocurrency/info"
        # Try as symbol first
        try:
            response = requests.get(url, headers=HEADERS, params={"symbol": query.upper()})
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError:
            # Fallback to slug (e.g. "SafeMoon" -> "safemoon", "FTX Token" -> "ftx-token")
            slug = query.lower().replace(" ", "-")
            response = requests.get(url, headers=HEADERS, params={"slug": slug})
            response.raise_for_status()
            return response.json()

    @staticmethod
    def get_latest_quotes(query: str):
        url = f"{BASE_URL}/v2/cryptocurrency/quotes/latest"
        try:
            response = requests.get(url, headers=HEADERS, params={"symbol": query.upper()})
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError:
            slug = query.lower().replace(" ", "-")
            response = requests.get(url, headers=HEADERS, params={"slug": slug})
            response.raise_for_status()
            return response.json()

    @staticmethod
    def get_historical_quotes(cmc_id: int, count: int = 90):
        # Note: /v3/cryptocurrency/quotes/historical requires enterprise plan on actual CMC
        # We'll build the wrapper. In a real hackathon, they provide specific keys or endpoints
        url = f"{BASE_URL}/v3/cryptocurrency/quotes/historical"
        params = {"id": cmc_id, "count": count, "interval": "1d"}
        response = requests.get(url, headers=HEADERS, params=params)
        if response.status_code != 200:
            # Fallback or mock if plan is not supported
            return {"error": response.text, "status_code": response.status_code}
        return response.json()

    @staticmethod
    def get_category(category_id: str):
        url = f"{BASE_URL}/v1/cryptocurrency/category"
        params = {"id": category_id}
        response = requests.get(url, headers=HEADERS, params=params)
        if response.status_code != 200:
            return {"error": response.text, "status_code": response.status_code}
        return response.json()

    @staticmethod
    def get_dex_pairs(contract_address: str):
        # Mocking DEX endpoint as CMC recently added this
        url = f"{BASE_URL}/v4/dex/pairs/quotes/latest"
        params = {"contract_address": contract_address}
        response = requests.get(url, headers=HEADERS, params=params)
        if response.status_code != 200:
             return {"error": response.text, "status_code": response.status_code}
        return response.json()
