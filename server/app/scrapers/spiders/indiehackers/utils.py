from app.logging_config import get_logger
import requests
from urllib.parse import urlparse, unquote
import bs4
import json
import urllib.parse
import re

logger = get_logger(__name__)

def extract_author_urls(urls: list[str]) -> list[dict[str, str]]:
    """Filter URLs -> slugs to only include Indie Hackers author profile pages."""

    authors = []
    NON_USER = {"post", "forum", "tag", "search", "pricing", "about", "terms", "privacy", "stories", "jobs", "events", "products", "podcast", "community", "resources", "help", "contact", "login", "signup", "ideas","newest","starting-up","trending","popular", "ai-coding-tools", }


    logger.info(f"Extracting author URLs from {len(urls)} URLs")

    for u in urls: # Step 2: Filter URLs
        p = urlparse(u)

        netloc = p.netloc.lower().split(":", 1)[0]
        if netloc not in ("indiehackers.com", "www.indiehackers.com"):
            continue

        path = unquote(p.path)
        slug = path.strip("/")
        if not slug or "/" in slug or slug.lower() in NON_USER: # Step 3: Check for valid slug (not one of the non-user paths)
            continue

        authors.append({ "slug": slug, "url": u })

    return authors

def get_algolia(): # Initially used to fetch Algolia credentials
    html   = requests.get("https://www.indiehackers.com").text       
    soup   = bs4.BeautifulSoup(html, "html.parser")
    meta   = soup.find("meta", {
                 "name": re.compile(r"indie-hackers/config/environment", re.I)
             })
    env    = json.loads(urllib.parse.unquote(meta["content"]))

    print(env["algolia"]["applicationId"])        # N86T1R3OWZ
    print(env["algolia"]["searchOnlyApiKey"])     # 5140dac5e87…
    print(env["algolia"])              # This contains index names
    print(env)


