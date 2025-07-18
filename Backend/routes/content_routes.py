from fastapi import APIRouter, Depends, HTTPException, Body, Request , status
from fastapi.responses import JSONResponse 
from fastapi.encoders import jsonable_encoder
from sqlmodel import Session, select
from config.db import get_session
from models.content_model import Content, ContentCreate, ContentUpdate
from auth.user_dependency_auth import get_current_user
from models.user_model import User
from datetime import datetime, timezone
from dotenv import load_dotenv
from utils.gemini_writer import generate_article
from core.limiter import limiter

# Access limiter from app
from fastapi import APIRouter


load_dotenv()

content_router = APIRouter()

@content_router.post("/")
def create_content(
    content_data: ContentCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    new_content = Content(
        title=content_data.title,
        body=content_data.body,
        user_id=current_user.id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    session.add(new_content)
    session.commit()
    session.refresh(new_content)

    return JSONResponse(
        content={"message": "Content created successfully", "content_id": new_content.id},
        status_code=status.HTTP_201_CREATED
    )


@content_router.get("/")
def get_all_user_content(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    contents = session.exec(select(Content).where(Content.user_id == current_user.id)).all()
    encoded_contents = jsonable_encoder(contents)
    return JSONResponse(content={"contents": encoded_contents}, status_code=200)


@content_router.get("/{content_id}")
def get_single_content(
    content_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    content = session.get(Content, content_id)
    if not content or content.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content not found")

    encoded_contents = jsonable_encoder(content)
    return JSONResponse(content={"content": encoded_contents}, status_code=200)


@content_router.put("/{content_id}")
def update_content(
    content_id: int,
    updated_data: ContentUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    content = session.get(Content, content_id)
    if not content or content.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content not found")

    if updated_data.title:
        content.title = updated_data.title
    if updated_data.body:
        content.body = updated_data.body

    content.updated_at = datetime.now(timezone.utc)
    session.add(content)
    session.commit()
    session.refresh(content)

    encoded_content = jsonable_encoder(content)
    return JSONResponse(
        content={"message": "Content updated successfully", "content": encoded_content},
        status_code=status.HTTP_200_OK
    )


@content_router.delete("/{content_id}")
def delete_content(
    content_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    content = session.get(Content, content_id)
    if not content or content.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content not found")

    session.delete(content)
    session.commit()
    return JSONResponse(content={"message": "Content deleted successfully"}, status_code=status.HTTP_200_OK)



@content_router.post("/generate")
@limiter.limit("3/minute")
def generate_content(
    request: Request,
    topic: str = Body(..., embed=True),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    try:
        generated_text = generate_article(topic)

        new_content = Content(
            title=topic,
            body=generated_text,
            user_id=current_user.id
        )

        return JSONResponse(
            content={
                "title": topic,
                "generated": generated_text,
                "saved_content_id": new_content.id
            },
            status_code=201
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")