from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class HealthStatus(BaseModel):
    status: str


@router.get("/health", response_model=HealthStatus, tags=["Health"])
async def health_check() -> HealthStatus:
    """
    Health check endpoint to verify if the API is running.
    Returns a simple JSON response indicating the status of the API.
    """
    return HealthStatus(status="ok")
