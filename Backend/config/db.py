from sqlmodel import create_engine, SQLModel, Session
import os
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DB_CONN_STRING")


engine = create_engine(db_url)


def init_db():
    SQLModel.metadata.create_all(engine)
    print("Database tables created")

def get_session():
    with Session(engine) as session:
        print("Session created")
        yield session