import random
from app.models.lead import Lead
import time
from app.scrapers.spiders.indiehackers.fetch import (fetch_author_page,
    fetch_sitemap_urls)
from app.scrapers.spiders.indiehackers.utils import extract_author_urls
from app.logging_config import get_logger

logger = get_logger(__name__)

def scrape_indiehackers(limit: int) -> list[Lead]:
    """Main entry: scrape all author leads from Indie Hackers sitemaps."""
    sitemap_url = "https://storage.googleapis.com/indie-hackers.appspot.com/sitemaps/ih-sitemap-5.xml" # Only #5 has authors

    leads: list[Lead] = []
    lead_count = 0

    page_urls = fetch_sitemap_urls(sitemap_url) # Step 1: Fetch page URLs
    authors = extract_author_urls(page_urls) # Step 2: Extract author URLs in pages

    logger.info(f"Found {len(authors)} author URLs in {sitemap_url}")

    for author in authors: # Step 3: Parse each author page
        if lead_count >= limit:
            logger.info(f"Reached limit of {limit} leads")
            return leads
        
        lead = fetch_author_page(author)

        if lead:
            leads.append(lead)
            lead_count += 1
        time.sleep(random.uniform(3.0, 10.0))  # Polite delay per author

    return leads