from pydantic import BaseModel
from google.oauth2 import id_token


class TokenPayload(BaseModel):
    id_token: str

