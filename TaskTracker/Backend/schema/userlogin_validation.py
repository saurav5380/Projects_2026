from pydantic import BaseModel, Field, ConfigDict

class UserLogin(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    username: str = Field(..., min_length=4)
    password: str = Field(..., min_length=8, max_length=128)
    