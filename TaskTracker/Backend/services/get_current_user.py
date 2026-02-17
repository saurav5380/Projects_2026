import os
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from db import get_db
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from jose import jwt, JWTError, ExpiredSignatureError
from typing import Any

load_dotenv()

SECRET_KEY = str(os.getenv("SECRET_KEY"))
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token:str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> dict :

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorised token")
        response = db.execute(text("SELECT username, password, email FROM users WHERE username = :username"), {"username":username})
        user_data: Any = response.fetchone()
        
    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired. Please login again.")
    
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorised access")
    
    return {
        "user_id": user_data[0],
        "email": user_data[1],
        "username": user_data[2],
    }



