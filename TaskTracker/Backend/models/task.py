from db import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import (String, Integer, DateTime, ForeignKey)
from sqlalchemy.sql import func


class Task(Base):
    __tablename__= "task"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'))
    description: Mapped[String] = mapped_column(String, nullable=False)
    status: Mapped[String] = mapped_column(String, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
