from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.admin import seed_all, setup_admin
from src.auth.blacklist import close_redis_client, get_redis_client
from src.auth.routes import router as auth_router
from src.cases.routes import router as cases_router
from src.config import settings
from src.database.session import close_db, init_db
from src.investigators.routes import router as investigators_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: manages Database schema, Admin seeding, and Redis connection pool."""
    # Ensure database tables exist and seed admin
    await init_db()
    try:
        await seed_all()
    except Exception:
        pass

    # Verify Redis (with fallback)
    try:
        redis_client = await get_redis_client()
        await redis_client.ping()
    except Exception:
        pass
    yield
    await close_redis_client()
    await close_db()


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="TRACE — Solana Onchain Detective Game Backend",
    lifespan=lifespan,
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(auth_router)
app.include_router(investigators_router)
app.include_router(cases_router)

# Mount Starlette Admin panel at /admin
setup_admin(app)


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "app": settings.app_name, "version": "0.1.0"}
