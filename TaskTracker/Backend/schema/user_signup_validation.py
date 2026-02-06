from pydantic import BaseModel, Field, ConfigDict, EmailStr, StringConstraints, field_validator
from typing import Annotated

class UserSignup(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    username: str = Field(..., min_length=4)
    password: str = Field(..., min_length=8, max_length=128)
    full_name: str = Field(..., min_length=8, max_length=50)
    email: Annotated[EmailStr, StringConstraints(to_lower=True)]

    @field_validator("password")
    @classmethod
    def password_validator(cls, v:str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain one uppercase letter")
        if not any(char.isdigit() for char in v):
            raise ValueError("Password must contain a digit")
        return v
    
    