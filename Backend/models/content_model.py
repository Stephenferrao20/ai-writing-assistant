# models/content_model.py
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime , UTC

class Content(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    title: str
    body: str
    created_at: datetime = Field(default_factory=lambda:datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda:datetime.now(UTC))

class ContentCreate(SQLModel):
    title: str
    body: str

class ContentUpdate(SQLModel):
    title: Optional[str] = None
    body: Optional[str] = None
