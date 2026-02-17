
from fastapi import FastAPI, Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from models.task import Task
from db import get_db


router = APIRouter()

@router.post("/deletetask/{task_id}")
async def delete_task(task_id: int, db:Session = Depends(get_db)):
    try:
        
        task_delete_result = db.query(Task).filter(Task.id == task_id).first()
        if task_delete_result:
            return {"message": f"Task id : {task_id} has been deleted"}
        elif task_delete_result is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found in task list")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"could not delete the task due to error: {str(e)}")




