
from fastapi import Depends,APIRouter, status, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from db import get_db
from schema.userlogin_validation import UserLogin
from schema.user_add_task_validation import AddTask
from models.task import Task

router = APIRouter()

@router.post("/addtask", status_code=status.HTTP_200_OK)
def add_new_task(user_data: UserLogin, new_task: AddTask, db: Session = Depends(get_db)):
    current_user = user_data.username
    
    try:
        result = db.execute(text("SELECT id FROM users WHERE username = :current_username"), {"current_username": current_user}).fetchone()
        if result is None:
            raise HTTPException(status_code=404, detail="User not found")
        new_task_entry = Task(
            user_id=result.id,
            task=new_task.task,
            description=new_task.description,
            status=new_task.status.value
        )
        db.add(new_task_entry)
        db.commit()
        db.refresh(new_task_entry)
        return {"message": "Task added to task list"}   
    except HTTPException:
        raise    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not add task")
        