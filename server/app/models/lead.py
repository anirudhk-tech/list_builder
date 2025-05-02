from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional

class Lead(BaseModel):
    id: str
    name: str
    profile_url: HttpUrl
    title: Optional[str]
    source: Optional[str]
    scraped_at: datetime
    
class IndieHackersLead(BaseModel):
    id: str
    name: str
    profile_url: HttpUrl
    title: Optional[str]
    source: Optional[str]
    scraped_at: datetime