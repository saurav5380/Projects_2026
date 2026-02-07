from fastapi import FastAPI, HTTPException, Depends, APIRouter, status
from passlib.context import CryptContext
from sqlalchemy import text
from sqlalchemy.orm import Session
from db import get_db
from schema.userlogin_validation import UserLogin

router = APIRouter()

@router.post("/login", status_code= status.HTTP_200_OK)
async def user_login(user_data: UserLogin, db: Session = Depends(get_db)):
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    def validate_password(pwd: str, pwd_hash: str):
         return pwd_context.verify(pwd, pwd_hash)
    try:
        user_exists = db.execute(text("SELECT username, password_hash FROM users WHERE username=:username"), {"username" : user_data.username}).fetchone()
        if (user_exists):
                result = db.execute(text("SELECT password_hash FROM users WHERE username=:username"),{"username": user_data.username}).fetchone()
                
                if result:
                     stored_pwd_hash = result[0]
                     validate_user = validate_password(user_data.password, stored_pwd_hash)
                if result is None:
                     raise HTTPException(status_code=401, detail="Invalid username or password")
                if validate_user:
                     # create user token
                     print("User Authenticated")
                     raise HTTPException(status_code=200, detail=status.HTTP_200_OK)
                    

    except Exception as e:
         return {"message": f"login failed due to error: {str(e)}"}
    
        
