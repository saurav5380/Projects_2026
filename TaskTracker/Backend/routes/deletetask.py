
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from models.task import Task
from db import get_db
from services.get_current_user import get_current_user

router = APIRouter()

@router.post("/deletetask/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: int, current_user = Depends(get_current_user), db:Session = Depends(get_db)):
    try:
        username = current_user["username"]
        if username is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="username does not exist")
        task_delete_result = db.query(Task).filter(Task.id == task_id).first()
        if task_delete_result:
            return {"message": f"Task id : {task_id} has been deleted"}
        elif task_delete_result is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found in task list")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"could not delete the task due to error: {str(e)}")




