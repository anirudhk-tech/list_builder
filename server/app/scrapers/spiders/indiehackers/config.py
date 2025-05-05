import requests
from requests.adapters import HTTPAdapter

ROBOTS_URL = "https://indiehackers.com/robots.txt"
ALGOLIA_APP_ID = "N86T1R3OWZ"
ALGOLIA_API_KEY = "5140dac5e87f47346abbda1a34ee70c3"
INDEX = "users"
URL = f"https://{ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/{INDEX}/query"
MAX_DEPTH = 10
USERNAME_PREFIXES = list("abcdefghijklmnopqrstuvwxyz0123456789_-.")

SESSION = requests.Session()
ADAPTER: HTTPAdapter = HTTPAdapter(max_retries=3)
SESSION.mount("https://", ADAPTER)
POLITE_PAUSE_RANGE = (0.5, 1.5)  # seconds
HEAVY_PAUSE_RANGE = (8, 15)  # seconds
SUPER_HEAVY_PAUSE_RANGE = (30, 60)  # seconds

USER_AGENTS = [
    # Desktop – Chrome on Windows 10
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"
    " Chrome/114.0.5735.199 Safari/537.36",

    # Desktop – Firefox on Windows 11
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:116.0) Gecko/20100101 Firefox/116.0",

    # Desktop – Edge on Windows 10
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"
    " Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.67",

    # Desktop – Safari on macOS Ventura
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3) AppleWebKit/605.1.15 (KHTML, like Gecko)"
    " Version/16.4 Safari/605.1.15",

    # Desktop – Chrome on macOS Monterey
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/537.36 (KHTML, like Gecko)"
    " Chrome/114.0.5735.199 Safari/537.36",

    # Mobile – Safari on iPhone iOS 17
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15"
    " (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/605.1.15",

    # Mobile – Chrome on Android 14
    "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko)"
    " Chrome/114.0.5735.199 Mobile Safari/537.36",

    # Mobile – Firefox on Android 13
    "Mozilla/5.0 (Android 13; Mobile; rv:116.0) Gecko/116.0 Firefox/116.0",

    # Mobile – Edge on Android 14
    "Mozilla/5.0 (Linux; Android 14; SM-G991U) AppleWebKit/537.36 (KHTML, like Gecko)"
    " Chrome/114.0.5735.199 Mobile Safari/537.36 EdgA/114.0.1823.67",

    # Tablet – Safari on iPadOS 17
    "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15"
    " (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/605.1.15",
]

HEADERS = {
    "X-Algolia-Application-Id": ALGOLIA_APP_ID,
    "X-Algolia-API-Key": ALGOLIA_API_KEY,
    "Content-Type": "application/json",
}

