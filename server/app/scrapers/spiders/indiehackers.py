import datetime
import feedparser # type: ignore
import uuid
import requests
from bs4 import BeautifulSoup
from app.models.lead import Lead
import urllib.parse
import json
from app.services.algolia_client import AlgoliaClient
from app.logging_config import get_logger

ALGOLIA_APP_ID = None
ALGOLIA_API_KEY = None
client = None
logger = get_logger(__name__)

def get_algolia_client(meta):
    """
    Lazy load Algolia client with application ID and API key.
    """
    global ALGOLIA_APP_ID, ALGOLIA_API_KEY, client
    
    if not ALGOLIA_APP_ID:
        ALGOLIA_APP_ID = meta["algolia"]["applicationId"]
    
    if not ALGOLIA_API_KEY:
        ALGOLIA_API_KEY = meta["algolia"]["searchOnlyApiKey"]
    
    if not client and ALGOLIA_APP_ID and ALGOLIA_API_KEY:
        client = AlgoliaClient(ALGOLIA_APP_ID, ALGOLIA_API_KEY)

    return client


def scrape_indiehackers_meta(company_url: str):
    """
    Returns meta content for a given Indie Hackers company URL.
    """

    if not company_url: return None # Return None if no URL is provided

    response = requests.get(company_url, timeout=10) # Step 1: Fetch the page
    response.raise_for_status() # Raise an error for bad status codes

    doc = BeautifulSoup(response.text, "html.parser") # Step 2: Parse the HTML
    meta = doc.find("meta", { "name": "indie-hackers/config/environment" }) # Step 3: Find the meta tag

    if not meta or not meta.get("content"): # Check if the meta tag exists and has content
        raise RuntimeError("Failed to find Indie Hackers meta tag.")
    
    raw = urllib.parse.unquote(meta["content"]) # Step 4: Decode the content
    return json.loads(raw)

def scrape_indiehackers_deep(company_url: str, entry: dict = None):
    """
    Returns additional data for a given Indie Hackers company URL
    """
    meta = scrape_indiehackers_meta(company_url) # Step 1: Fetch meta content
    if not meta: return None # Return None if no meta content is found

    client = get_algolia_client(meta) # Step 2: Initialize Algolia client

    author = entry.get("author", None) # Step 3: Get author from entry

    logger.debug("Entry keys for %s: %s", entry.get("link"), list(entry.keys()))
    
    if not entry or not author or not client:
        return None
    
    hits = client.search( # Step 4: Search Algolia index
        index="users",
        query=author, 
        attributes=["username", "fullName", "bio", "location", "followersCount", "websiteUrl"],
        hits_per_page=50,
    )

    now = datetime.datetime.utcnow()

    logger.debug("Algolia hits for %r: %s", author, json.dumps(hits, indent=2)) # Debugging: Print hits

    data = { # Step 5: Prepare and return data for Lead object
        "id": str(uuid.uuid4()),
        "name": entry.get("author", None),
        "company_url": entry.get("link", None),
        "title": entry.get("title", None),
        "bio": entry.get("summary", None),
        "published": entry.get("published"),
        "published_parsed": entry.get("published_parsed"),
        "tags": [t.term for t in entry.get("tags", [])],
        "content": entry.get("content", []),
        "source": "indiehackers",
        "scraped_at": now,
        "raw": entry,   
    }

    return data
    
def scrape_indiehackers_rss():
    """
    Fetches the Indie Hackers RSS feed and yields Lead objects.
    """

    NEWEST_FEED_URL = "https://ihrss.io/newest"
    FEAT_FEED_URL = "https://ihrss.io/featured"
    ORG_FEED_URL = "https://ihrss.io/organic"

    newest_feed = feedparser.parse(NEWEST_FEED_URL)
    feat_feed = feedparser.parse(FEAT_FEED_URL)
    org_feed = feedparser.parse(ORG_FEED_URL)

    feed = newest_feed.entries + feat_feed.entries + org_feed.entries
    leads = []
    
    for entry in feed:
        data = scrape_indiehackers_deep(entry.get("link", None), entry)

        if not data: continue

        lead = Lead(**data)
        leads.append(lead)
    
    return leads