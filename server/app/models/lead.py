from pydantic import BaseModel, HttpUrl, Field
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import List, Optional, Dict, Any
import uuid


class ContactInfo(BaseModel):
    method: str  # e.g. "email", "twitter", "linkedin"
    value: str  # e.g. "user@example.com", "@handle"


class EngagementMetrics(BaseModel):
    followers: Optional[int]
    public_repos: Optional[int]  # for GitHub
    recent_posts: Optional[int]  # posts in last 30 days
    last_active: Optional[datetime]  # last timestamp we saw activity


class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Optional[str] = None  # e.g. "John Doe"
    username: Optional[str] = None  # e.g. "johndoe"
    profile_url: Optional[HttpUrl] = None
    title: Optional[str] = None  # e.g. "Full-Stack Engineer"
    bio: Optional[str] = None
    website: Optional[HttpUrl] = None  # e.g. "https://example.com"
    location: Optional[str] = None
    source: str  # “indiehackers”, “github”, etc.
    tags: List[str] = []  # e.g. ["react", "nodejs", "climate"]
    skills: List[str] = []  # parsed skills
    contacts: List[ContactInfo] = []
    engagement: Optional[EngagementMetrics] = EngagementMetrics(
        followers=None, public_repos=None, recent_posts=None, last_active=None
    )
    scraped_at: datetime
    match_score: Optional[float] = None  # computed by your ranking agent
    embeddings: Optional[List[float]] = []  # for semantic similarity
    raw: Optional[Dict[str, Any]]  # dump of the original scraped JSON
