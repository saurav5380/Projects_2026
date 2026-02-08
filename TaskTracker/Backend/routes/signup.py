from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import get_db
from schema.user_signup_validation import UserSignup
from passlib.context import CryptContext

ctx = CryptContext(schemes=['bcrypt'])

router = APIRouter()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def new_user_signup(user_data: UserSignup, db: Session = Depends(get_db)):
    try:
        # duplicate email
        duplicate_email = db.execute(text("SELECT username FROM public.users WHERE email = :user_email"),{"user_email" : user_data.email}).fetchone()
        if duplicate_email:
            raise HTTPException(status_code=409, detail="Email exists. Login with your credentials")
        
        query = text("INSERT INTO public.users (username, password_hash, full_name, email) VALUES (:username, :pwd_hash, :fullname, :email")
        if user_data:
            # duplicate user check
            duplicate_user = db.execute(text("SELECT username FROM public.users WHERE username = :username"),{"username" : user_data.username}).fetchone()
            if duplicate_user:
                raise HTTPException(status_code=409, detail="Username already taken. Select another username")
            new_user_data = {
                "username": user_data.username,
                "pwd_hash": ctx.hash(user_data.password),
                "fullname": user_data.full_name,
                "email": user_data.email
            }
            result = db.execute(query, new_user_data)
            if result:
                db.commit()
                return {"message": "User created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail={"msg": f"Signup failed due to error: {str(e)}"})
    