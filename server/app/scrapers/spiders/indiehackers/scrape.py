from app.models.lead import Lead
from app.logging_config import get_logger
from app.scrapers.spiders.indiehackers.fetch import fetch_all_leads
import typing

logger = get_logger(__name__)


def scrape_indiehackers(limit: typing.Optional[int] = None) -> list[Lead]:
    """Main entry: scrape all author leads from Indie Hackers sitemaps."""
    leads = fetch_all_leads(limit)

    return leads
