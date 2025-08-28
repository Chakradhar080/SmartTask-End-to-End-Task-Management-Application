import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Read from environment variable (set in docker-compose.yml)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://taskuser2:taskpass2@db:3306/taskdb2" # DATABASE_URL = "mysql+pymysql://taskuser:taskpass@127.0.0.1:3306/taskdb" To run in localhost
)

engine = create_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def init_db():
    from . import models
    Base.metadata.create_all(bind=engine)
