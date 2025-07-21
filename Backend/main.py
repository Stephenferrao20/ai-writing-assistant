from fastapi import FastAPI 
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from routes.user_routes import user_router
from routes.content_routes import content_router
from config.db import init_db
from core.limiter import limiter
from slowapi.errors import RateLimitExceeded
from fastapi import Request

load_dotenv()
app = FastAPI()

# Include routers
app.include_router(user_router)
app.include_router(content_router,prefix="/content",tags=["Content"])

app.state.limiter = limiter

# Allow specific origins (frontend URLs)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://ai-writing-assistant-cyan.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RateLimitExceeded)
def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"message": "Rate limit exceeded. Please try again later."}
    )


# Create tables at startup
@app.on_event("startup")
def on_startup():
    init_db()



@app.get("/")
def read_root():
    return JSONResponse(content={"message": "Hello World"}, status_code=200)

@app.get("/health")
def health_check():
    return JSONResponse(content={"status": "ok"}, status_code=200)

