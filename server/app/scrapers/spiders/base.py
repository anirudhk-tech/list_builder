from app.scrapers.spiders.indiehackers.scrape import scrape_indiehackers
from app.models.lead import Lead


def scrape(limit: int) -> list[Lead]:
    """
    Scrapes for data across all spiders and returns a list of leads.
    """
    leads = scrape_indiehackers(limit)

    return leads
