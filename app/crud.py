from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from typing import List, Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------------- Task CRUD ----------------
def create_task(db: Session, task_in: schemas.TaskCreate, user: models.User) -> models.Task:
    db_task = models.Task(**task_in.dict(), user_id=user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_task(db: Session, task_id: int, user: models.User) -> Optional[models.Task]:
    return db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == user.id).first()

def list_tasks(db: Session, user: models.User, status: Optional[str] = None, search: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[models.Task]:
    q = db.query(models.Task).filter(models.Task.user_id == user.id)
    if status:
        q = q.filter(models.Task.status == status)
    if search:
        q = q.filter(models.Task.title.ilike(f"%{search}%"))
    return q.offset(skip).limit(limit).all()

def update_task(db: Session, db_task: models.Task, task_in: schemas.TaskUpdate) -> models.Task:
    data = task_in.dict(exclude_unset=True)
    for key, value in data.items():
        setattr(db_task, key, value)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, db_task: models.Task) -> None:
    db.delete(db_task)
    db.commit()

# ---------------- User CRUD ----------------
def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user_in: schemas.UserCreate) -> models.User:
    hashed = pwd_context.hash(user_in.password)
    db_user = models.User(username=user_in.username, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
