from fastapi import FastAPI # type: ignore[import]
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.leads import router as leads_router
from app.logging_config import configure_root_logger

configure_root_logger()  # Configure logging at startup

def create_app() -> FastAPI:
    configure_root_logger()

    app = FastAPI(
        title="Lead Scraper API",
        version="0.1.0",
        docs_url="/docs",
        openapi_url="/openapi.json",
    )
    
    app.include_router(health_router, prefix="/api/v1")
    app.include_router(leads_router, prefix="/api/v1")
    
    return app

app = create_app()
