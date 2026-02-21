from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
from models.task import Task
from db import get_db
from services.get_current_user import get_current_user

router = APIRouter()

class UpdateTaskRequest(BaseModel):
    task: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

@router.patch("/updatetask/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_task(task_id: int, payload: UpdateTaskRequest, current_user = Depends(get_current_user), db:Session = Depends(get_db)):
    try:
        task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user["id"]).first()
        if task is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        updates = payload.model_dump(exclude_none=True)
        for key, value in updates.items():
            setattr(task, key, value)
        task.updated_at = datetime.now(timezone.utc)
        db.commit()

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"could not update the task due to error: {str(e)}")
