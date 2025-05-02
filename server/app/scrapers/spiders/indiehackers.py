import datetime
import feedparser
import uuid
from app.models.lead import IndieHackersLead as Lead

def scrape_indiehackers_rss():
    """
    Fetches the Indie Hackers "Launches" RSS feed and yields Lead objects.
    """
    FEED_URL = "https://ihrss.io/newest"
    feed = feedparser.parse(FEED_URL)
    leads = []
    for entry in feed.entries:
        leads.append(Lead (
            id=str(uuid.uuid4()),
            name=entry.get("author", ""),
            profile_url=entry.get("link", ""),
            title=entry.get("title", ""),
            source="indiehackers",
            scraped_at=datetime.datetime.utcnow()
        ))
    
    return leads