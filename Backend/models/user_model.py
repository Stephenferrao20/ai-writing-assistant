# models/user_model.py

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime , UTC

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(index=True, unique=True)
    password: Optional[str] = Field(default=None, nullable=True)  
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

class UserCreate(SQLModel):
    name: str
    email: str
    password: str

class UserLogin(SQLModel):
    email: str
    password: str

class UserRead(SQLModel):
    id: int
    name: str
    email: str

class GoogleUser(SQLModel):
    name: str
    email: str
