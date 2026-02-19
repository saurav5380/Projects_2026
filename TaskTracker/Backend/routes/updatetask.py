from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from models.task import Task
from db import get_db
from services.get_current_user import get_current_user

router = APIRouter()

class UpdateTaskRequest(BaseModel):
    task: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

@router.post("/updatetask/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_task(task_id: int, payload: UpdateTaskRequest, current_user = Depends(get_current_user), db:Session = Depends(get_db)):
    try:
        username = current_user["username"]
        if username is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="username does not exist")
        task = db.query(Task).filter(Task.id == task_id).first()
        if task is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        updates = payload.model_dump(exclude_none=True)
        for key, value in updates.items():
            setattr(task, key, value)
        db.commit()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"could not update the task due to error: {str(e)}")
