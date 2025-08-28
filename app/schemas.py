from pydantic import BaseModel, Field
from typing import Optional

# Task schemas
class TaskBase(BaseModel):
    title: str = Field(..., max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    status: str = Field(..., regex="^(pending|in-progress|completed)$")

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    status: Optional[str] = Field(None, regex="^(pending|in-progress|completed)$")

class TaskOut(TaskBase):
    id: int
    class Config:
        orm_mode = True

# User schemas
class UserCreate(BaseModel):
    username: str = Field(..., max_length=50)
    password: str = Field(..., min_length=6)

class UserOut(BaseModel):
    id: int
    username: str
    class Config:
        orm_mode = True
