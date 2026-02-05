from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import (String, Integer, DateTime)
from sqlalchemy.sql import func
from db import Base


class Users(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[String] = mapped_column(String, unique=True, nullable=False)
    username: Mapped[String] = mapped_column(String, nullable=False)
    password_hash: Mapped[String] = mapped_column(String, nullable=False)
    full_name: Mapped[String] = mapped_column(String, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
