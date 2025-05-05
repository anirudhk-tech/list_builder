from app.logging_config import get_logger
from datetime import datetime, timezone
import json
import random
import time
import urllib.robotparser
from app.models.lead import Lead
import typing
from app.scrapers.spiders.indiehackers.config import (
    ROBOTS_URL,
    HEADERS,
    URL,
    SESSION,
    POLITE_PAUSE_RANGE,
)
from requests.exceptions import HTTPError, Timeout
from server.app.models.lead import ContactInfo

rp = urllib.robotparser.RobotFileParser()
rp.set_url(ROBOTS_URL)
rp.read()

logger = get_logger(__name__)


def fetch_leads_for_prefix(prefix: str, seen: set[str]) -> list[Lead]:
    prefix_leads: list[Lead] = []
    payload: dict[str, typing.Any] = {
        "query": prefix,
        "hitsPerPage": 1000,
        "restrictSearchableAttributes": ["username"],
        "queryType": "prefixAll",
        "typoTolerance": False,
    }

    for backoff in (
        1,
        2,
        4,
    ):  # Step 1: Retry logic and fetching with exponential timeouts
        try:
            response = SESSION.post(URL, json=payload, headers=HEADERS, timeout=10)
            response.raise_for_status()
            break
        except (Timeout, HTTPError):
            logger.warning(
                f"INDIEHACKERS: Request timed out for prefix {prefix}. Retrying in {backoff} seconds..."
            )
            time.sleep(backoff)

    else:
        logger.error(
            f"INDIEHACKERS: Request failed for prefix {prefix} after 3 retries."
        )
        return []

    data = response.json()  # Step 2: Parse the response
    hits = data.get("hits", [])

    logger.info(f"INDIEHACKERS: Fetched {len(hits)} leads for prefix {prefix}.")

    for u in hits:  # Step 3: Iterate through each user
        if u.get("username") in seen:
            continue

        lead = Lead(
            name=u.get("fullName"),
            username=u.get("username"),
            bio=u.get("bio"),
            tags=u.get("_tags", []),
            profile_url=u.get("url"),
            contacts=[
                ContactInfo(method="email", value=u.get("publicEmail", "")),
                ContactInfo(method="twitter", value=u.get("twitterHandle", "")),
            ],
            location=f"{u.get('city')}, {u.get('country')}",
            website=u.get("website") or u.get("websiteUrl"),
            source="indiehackers",
            scraped_at=datetime.now(timezone.utc),
            raw=u,
        )

        prefix_leads.append(lead)
        seen.add(u.get("username"))

    return prefix_leads


def fetch_all_leads(limit: typing.Optional[int] = None) -> list[Lead]:
    """Fetch all leads from Indie Hackers."""
    leads: list[Lead] = []
    seen: set[str] = set()
    remaining = limit if limit else None

    with open("ih_buckets.json", "r") as f:
        subdivisions = json.load(f)

    for idx, prefix in enumerate(
        subdivisions, 1
    ):  # Step 1: Iterate through each prefix of precomputed subdivisions
        try:
            new_leads = fetch_leads_for_prefix(
                prefix, seen
            )  # Step 2: Fetch leads for each prefix
            leads.extend(new_leads)
        except Exception as e:
            logger.error(
                f"INDIEHACKERS: Error fetching leads for prefix {prefix}: {e}. Skipping..."
            )
            continue

        if remaining is not None:  # Step 3: Check if the limit is reached and return
            remaining -= len(new_leads)
            if remaining <= 0:
                over = abs(remaining)
                leads = leads[:-over]
                logger.info(
                    f"INDIEHACKERS: Limit of {limit} leads reached. Stopping fetch."
                )
                return leads

        time.sleep(
            random.uniform(*POLITE_PAUSE_RANGE)
        )  # Step 4: Polite pause for a random time between 0.5 and 1.5 seconds

        if idx % 100 == 0:
            logger.info(
                f"Processed {idx}/{len(subdivisions)} prefixes, collected {len(leads)} users so far"
            )

    logger.info(
        f"INDIEHACKERS: No limit was reached/provided. Collected {len(leads)} unique users from {len(subdivisions)} prefixes."
    )
    return leads
