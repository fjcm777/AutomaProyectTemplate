from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.categories.models import Category


class CategoryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list(self, page: int, page_size: int, is_active: bool | None = True) -> tuple[list[Category], int]:
        stmt = select(Category)
        count_stmt = select(func.count()).select_from(Category)
        if is_active is not None:
            stmt = stmt.where(Category.is_active == is_active)
            count_stmt = count_stmt.where(Category.is_active == is_active)

        total = (await self.db.execute(count_stmt)).scalar_one()

        stmt = stmt.order_by(Category.id.desc()).offset((page - 1) * page_size).limit(page_size)
        result = await self.db.execute(stmt)
        return list(result.scalars().all()), total

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
