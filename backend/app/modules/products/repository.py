from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.products.models import Product


class ProductRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list(self, page: int, page_size: int, is_active: bool | None = True) -> tuple[list[Product], int]:
        stmt = select(Product)
        count_stmt = select(func.count()).select_from(Product)
        if is_active is not None:
            stmt = stmt.where(Product.is_active == is_active)
            count_stmt = count_stmt.where(Product.is_active == is_active)

        total = (await self.db.execute(count_stmt)).scalar_one()

        stmt = stmt.order_by(Product.id.desc()).offset((page - 1) * page_size).limit(page_size)
        result = await self.db.execute(stmt)
        return list(result.scalars().all()), total

    async def get(self, product_id: int) -> Product | None:
        result = await self.db.execute(select(Product).where(Product.id == product_id))
        return result.scalar_one_or_none()

    async def create(self, data: dict) -> Product:
        product = Product(**data)
        self.db.add(product)
        await self.db.commit()
        await self.db.refresh(product)
        return product

    async def update(self, product: Product, data: dict) -> Product:
        for key, value in data.items():
            setattr(product, key, value)
        await self.db.commit()
        await self.db.refresh(product)
        return product

    async def deactivate(self, product: Product) -> Product:
        # Logical delete: 08-api-contracts.md requires DELETE to deactivate, not remove the row.
        product.is_active = False
        await self.db.commit()
        await self.db.refresh(product)
        return product
