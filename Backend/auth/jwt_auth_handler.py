import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
import datetime
from datetime import UTC
import os
from dotenv import load_dotenv

load_dotenv()

jwt_secret = os.getenv("JWT_SECRET")
algorithm = "HS256"

# Jwt Initialization
def signJWT(user_id: str) -> str:
    payload = {
        "user_id": str(user_id),
        "exp": datetime.datetime.now(datetime.UTC) + datetime.timedelta(days=0, minutes=60)
    }
    token = jwt.encode(payload, jwt_secret, algorithm=algorithm)
    return token

# Jwt Decoding
def decodeJWT(token: str) -> dict | None:
    try:
        decoded_token = jwt.decode(token, jwt_secret, algorithms=[algorithm])
        return decoded_token if decoded_token["exp"] >= datetime.datetime.now(UTC).timestamp() else None
    except ExpiredSignatureError:
        return None
    except InvalidTokenError:
        return None