from app.logging_config import get_logger
from collections import deque
from app.scrapers.spiders.indiehackers.config import (
    HEADERS,
    URL,
    MAX_DEPTH,
    USERNAME_PREFIXES,
    SESSION,
    ALGOLIA_API_KEY,
    ALGOLIA_APP_ID,
    HEAVY_PAUSE_RANGE,
    SUPER_HEAVY_PAUSE_RANGE,
    HEADERS,
    USER_AGENTS
)
import json
import random
from requests.exceptions import HTTPError
import time
from pathlib import Path
from app.logging_config import configure_root_logger

configure_root_logger(logfile="logs/indiehackers.log")
logger = get_logger(__name__)


def build_subdivision(
    threshold: int = 1000,
    max_depth: int = MAX_DEPTH,
    prefixes: list[str] = USERNAME_PREFIXES,
):
    """Build a subdivision string based on the prefix and depth."""

    subdivisions: list[str] = []
    backoff = 1
    queue = deque(
        (p, 1) for p in prefixes
    )  # Step 1: Initialize queue with prefixes and depth 1

    while queue:
        prefix, depth = queue.popleft()  # Step 2: Pop the first element from the queue

        try:
            HEADERS["User-Agent"] = random.choice(USER_AGENTS)

            response = SESSION.post(  # Step 3: Make a POST request to the API
                URL,
                json={
                    "query": prefix,
                    "hitsPerPage": 0,
                    "restrictSearchableAttributes": ["username"],
                    "queryType": "prefixAll",
                    "typoTolerance": False,
                },
                headers=HEADERS,
                timeout=10,
            )

            response.raise_for_status()
            backoff = 1
        except HTTPError as e:
            status = e.response.status_code if hasattr(e, 'response') else None
            if status in (429, 403):
                backoff = min(backoff * 2, 60)
                if backoff > 30:
                    time.sleep(*SUPER_HEAVY_PAUSE_RANGE)
                else:
                    time.sleep(backoff + random.random() * backoff)
                queue.appendleft((prefix, depth))  # retry same prefix
                logger.warning(f"INDIEHACKERS: Rate limit hit (status={status}), backing off for {backoff}s before retrying prefix '{prefix}'")
                continue
            else:
                raise e

        nb_hits = response.json().get("nbHits", 0)

        if (
            nb_hits >= threshold and depth < max_depth
        ):  # Step 4: Check if the cap is reached AND depth is less than max_depth
            for c in USERNAME_PREFIXES:
                queue.append((prefix + c, depth + 1))  # Step 5: Append to queue for later processing
        else:  # Step 5: Either cap is reached or depth is maxed out
            if nb_hits == 0:
                logger.info(f"INDIEHACKERS: No hits for prefix '{prefix}'. Skipping...")
                continue

            logger.info(f"INDIEHACKERS: Prefix: '{prefix}', Hits: {nb_hits}, Depth: {depth}")
            subdivisions.append(prefix)

        base_sleep = random.uniform(*HEAVY_PAUSE_RANGE)
        jitter = random.uniform(0, 5)
        sleep_time = base_sleep + jitter
        logger.debug(f"INDIEHACKERS: Sleeping for {sleep_time:.2f}s (base={base_sleep:.2f}, jitter={jitter:.2f})")
        time.sleep(sleep_time)  # Step 6: Heavy polite pause

    with open(f"{Path(__file__).parent}/ih_buckets.json", "w") as f:
        json.dump(subdivisions, f, indent=4)  # Step 7: Write the subdivisions to a file

    logger.info(f"INDIEHACKERS: Created and wrote {len(subdivisions)} subdivisions to ih_buckets.json")


if __name__ == "__main__":
    build_subdivision(threshold=1000, max_depth=MAX_DEPTH, prefixes=USERNAME_PREFIXES)
    logger.info("INDIEHACKERS: Finished building subdivisions")
