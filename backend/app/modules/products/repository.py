from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.products.models import Product


class ProductRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list(self) -> list[Product]:
        result = await self.db.execute(select(Product).order_by(Product.id.desc()))
        return list(result.scalars().all())

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

    async def delete(self, product: Product) -> None:
        await self.db.delete(product)
        await self.db.commit()
