from jose import jwt
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone

load_dotenv()

SECRET_KEY: str = str(os.getenv("SECRET_KEY"))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRY_MINUTES = 30


def create_user_token(data:dict, expires_delta: timedelta):
    
    to_encode = data.copy()

    if expires_delta:
        expiry_time = datetime.now(timezone.utc) + expires_delta
    else:
        expiry_time = datetime.now(timezone.utc) + timedelta(minutes=30)
    
    to_encode.update({"exp": expiry_time})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, ALGORITHM)

    return encoded_jwt




