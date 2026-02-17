from pydantic import BaseModel, Field, ConfigDict
from enum import Enum
from datetime import datetime


class Status(Enum):
    new = "New",
    pending = "Pending",
    completed = "Completed"




class AddTask(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    task: str = Field(..., min_length=4)
    description: str = Field(..., min_length=8, max_length=128)
    status: Status
    