from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.categories.models import Category


class CategoryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list(self) -> list[Category]:
        result = await self.db.execute(select(Category).order_by(Category.id.desc()))
        return list(result.scalars().all())

    async def get(self, category_id: int) -> Category | None:
        result = await self.db.execute(select(Category).where(Category.id == category_id))
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Category | None:
        result = await self.db.execute(select(Category).where(Category.name == name))
        return result.scalar_one_or_none()

    async def create(self, data: dict) -> Category:
        category = Category(**data)
        self.db.add(category)
        await self.db.commit()
        await self.db.refresh(category)
        return category
