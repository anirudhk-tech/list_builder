from fastapi import APIRouter, Query
from typing import List, Optional
from app.models.lead import Lead
from app.scrapers.spiders.indiehackers import scrape_indiehackers_rss
from starlette.concurrency import run_in_threadpool

router = APIRouter()

@router.get("/leads", response_model=List[Lead], tags=["Leads"])
async def get_leads(
    type: Optional[str] = Query(None, description="Filter by lead type"),
    limit: int = Query(30, ge=1, le=100),
):
    """
    Retrieve a list of leads with optional filtering by type and pagination.
    - **type**: Optional filter to get leads of a specific type.
    - **limit**: Number of leads to return (default is 30, max is 100).
    """
    leads = await run_in_threadpool(scrape_indiehackers_rss)
    
    return leads[:limit]
