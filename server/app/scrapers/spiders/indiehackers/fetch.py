from app.logging_config import get_logger
import datetime
import urllib.robotparser
import xml.etree.ElementTree as ET
from app.models.lead import Lead
import requests # type: ignore[import]
import typing

ROBOTS_URL = "https://indiehackers.com/robots.txt"

rp = urllib.robotparser.RobotFileParser()
rp.set_url(ROBOTS_URL)
rp.read()

logger = get_logger(__name__)


def fetch_sitemap_urls(sitemap_url: str) -> list[str]:
    """Fetch a sitemap file and return list of page URLs."""
    response = requests.get(sitemap_url) # Step 1: Fetch the sitemap
    response.raise_for_status()
    root = ET.fromstring(response.content) # Step 2: Parse the XML
    ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"} # Step 3: Define the namespace
    return [u.find("ns:loc", ns).text for u in root.findall("ns:url", ns)] # Step 4: Extract URLs


def fetch_author_page(author: str) -> typing.Union[Lead, None]:
    ALGOLIA_APP_ID  = "N86T1R3OWZ"
    ALGOLIA_API_KEY = "5140dac5e87f47346abbda1a34ee70c3"
    INDEX           = "users"

    url = f"https://{ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/{INDEX}/query"
    headers = {
        "X-Algolia-Application-Id": ALGOLIA_APP_ID,
        "X-Algolia-API-Key":       ALGOLIA_API_KEY,
        "Content-Type":            "application/json"
    }
    params_str = (
        f'query={urllib.parse.quote_plus(author["slug"])}'
        '&hitsPerPage=1'
        '&restrictSearchableAttributes=["username"]'
    )
    payload = {"params":  params_str}
    
    r = requests.post(url, json=payload, headers=headers, timeout=10)
    r.raise_for_status()
    
    hits = r.json().get("hits", [])

    if not hits:
        return None
    
    u = hits[0]

    return Lead(
        name=u.get("fullName"),
        username=u.get("username"),
        bio=u.get("bio"),
        tags=u.get("_tags", []),
        profile_url=author['url'],
        contacts=[
            {"method": "email", "value": u.get("publicEmail", "")},
            {"method": "twitter", "value": u.get("twitterHandle", "")},
        ],
        location=f"{u.get('city')}, {u.get('country')}",
        website=u.get("website") or u.get("websiteUrl"),
        source="indiehackers",
        scraped_at=datetime.datetime.utcnow(),
        raw=u
    )