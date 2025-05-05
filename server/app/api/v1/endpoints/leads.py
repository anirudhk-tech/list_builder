from fastapi import APIRouter, Query  # type: ignore[import]
from app.models.lead import Lead
from app.scrapers.spiders.base import scrape
from starlette.concurrency import run_in_threadpool  # type: ignore[import]
from typing import Optional

router = APIRouter()


@router.get("/leads", response_model=list[Lead], tags=["Leads"])
async def get_leads(
    limit: Optional[int] = Query(None, description="Number of leads to return", ge=1),
):
    """
    Retrieve a list of leads with optional filtering by type and pagination.
    - **type**: Optional filter to get leads of a specific type.
    - **limit**: Number of leads to return (default is None).
    """
    leads = await run_in_threadpool(scrape, limit=limit)

    return leads
