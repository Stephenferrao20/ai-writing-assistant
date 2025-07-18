from fastapi import Request, HTTPException, Depends
from auth.jwt_auth_handler import decodeJWT
from sqlmodel import Session, select
from config.db import get_session
from models.user_model import User

async def get_current_user(request: Request, session: Session = Depends(get_session)) -> User:
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    decoded = decodeJWT(token)
    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = session.exec(select(User).where(User.id == int(decoded["user_id"]))).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
