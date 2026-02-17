
# needs to be a protected route - only user should be able to view their task list 

from fastapi import Depends,APIRouter, status, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from db import get_db
from schema.userlogin_validation import UserLogin

router = APIRouter()

@router.get("/tasklist", status_code=status.HTTP_200_OK)
def user_task_list(user_data: UserLogin, db: Session = Depends(get_db)):
    current_user = user_data.username
    try:
        result = db.execute(text("SELECT username FROM users WHERE username = :current_username"), {"current_username": current_user}).fetchone()
        if result is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        task = db.execute(text("SELECT task, description, status, created_at, updated_at FROM task WHERE username = :current_username"), {"current_username": current_user}).fetchall()
        return task
    except Exception as e:
        return {"message": f"Could not retrieve task list due to error: {str(e)}"}

