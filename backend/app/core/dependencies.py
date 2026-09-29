from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Provide one async SQLAlchemy session per request and close it safely."""

    async with AsyncSessionLocal() as db:
        yield db
