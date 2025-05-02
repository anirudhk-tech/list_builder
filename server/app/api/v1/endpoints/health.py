from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify if the API is running.
    Returns a simple JSON response indicating the status of the API.
    """
    return {"status": "ok"}