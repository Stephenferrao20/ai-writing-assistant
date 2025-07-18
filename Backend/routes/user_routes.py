from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse 
from sqlmodel import Session, select
from google.oauth2 import id_token
from passlib.context import CryptContext
from auth.jwt_auth_handler import signJWT
from auth.google_auth import TokenPayload
from google.auth.transport import requests
from models.user_model import User, UserCreate , UserLogin
from config.db import get_session
from auth.user_dependency_auth import get_current_user
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


user_router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@user_router.post("/register")
def register_user(user: UserCreate, session: Session = Depends(get_session)):
    try:
        existing_user = session.exec(select(User).where(User.email == user.email)).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed_password = pwd_context.hash(user.password)
        db_user = User(name=user.name, email=user.email, password=hashed_password)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)

        token = signJWT(db_user.id)
        response = JSONResponse(
            content={
                "message": "User registered successfully",
                "token": token,
                "user": str(db_user.name)
            },
            status_code=200
        )
        response.set_cookie(key="token" , value=token , httponly=True , secure=True , max_age=3600)
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@user_router.post("/login")
def login_user(user: UserLogin, session: Session = Depends(get_session) ):
    try:
        db_user = session.exec(select(User).where(User.email == user.email)).first()
        if not db_user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        if not pwd_context.verify(user.password, db_user.password):
            raise HTTPException(status_code=401, detail="Invalid Password")
        
        token = signJWT(db_user.id)
        response = JSONResponse(
            content={
                "message": "Login successful",
                "token": token,
                "user": str(db_user.name)
            },
            status_code=200
        )
        response.set_cookie(key="token" , value=token , httponly=True , secure=True , max_age=3600)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@user_router.post("/google_auth", response_model=None)
def google_login(payload: TokenPayload, session: Session = Depends(get_session)):
    try:
        # ✅ Verify the token with Google
        idinfo = id_token.verify_oauth2_token(
            payload.id_token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo["email"]
        name = idinfo.get("name", "")

        # 🔍 Check if user already exists
        existing_user = session.exec(select(User).where(User.email == email)).first()

        if existing_user:
            # ✅ User already exists, generate token
            token = signJWT(existing_user.id)
            response = JSONResponse(
                content={
                    "message": "User logged in successfully via Google",
                    "token": token,
                    "user": str(existing_user.name)
                },
                status_code=200
            )
        else:
            # 🆕 New user, create entry
            db_user = User(name=name, email=email)
            session.add(db_user)
            session.commit()
            session.refresh(db_user)

            token = signJWT(db_user.id)
            response = JSONResponse(
                content={
                    "message": "User registered and authenticated via Google",
                    "token": token,
                    "user": str(db_user.name)
                },
                status_code=201
            )

        # 🍪 Set the token as a secure cookie
        response.set_cookie(
            key="token",
            value=token,
            httponly=True,
            secure=True,
            max_age=3600
        )
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Invalid Google token: {str(e)}")


@user_router.get("/me")
def read_current_user(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "created_at": current_user.created_at
    }


@user_router.get("/logout")
def logout_user(current_user: User = Depends(get_current_user)):
    response = JSONResponse(content={"message": "Logged out successfully"}, status_code=200)
    response.delete_cookie(key="token")
    return response