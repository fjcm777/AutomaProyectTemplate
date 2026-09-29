from app.modules.products.repository import ProductRepository
from app.modules.products.schemas import ProductCreate, ProductUpdate
from app.modules.categories.service import CategoryService
from app.shared.exceptions import bad_request, not_found


class ProductService:
    """Business rules for product use cases."""

    def __init__(self, product_repository: ProductRepository, category_service: CategoryService):
        self.product_repository = product_repository
        self.category_service = category_service

    async def list_products(self):
        return await self.product_repository.list()

    async def get_product(self, product_id: int):
        product = await self.product_repository.get(product_id)
        if not product:
            raise not_found("Product not found", code="products.not_found")
        return product

    async def create_product(self, data: ProductCreate):
        # Guard FK integrity at service layer for clearer API errors.
        if data.category_id is not None:
            category = await self.category_service.get_category(data.category_id)
            if not category:
                raise bad_request("Category does not exist", code="products.category_not_found")

        return await self.product_repository.create(data.model_dump())

    async def update_product(self, product_id: int, data: ProductUpdate):
        product = await self.get_product(product_id)

        if data.category_id is not None:
            category = await self.category_service.get_category(data.category_id)
            if not category:
                raise bad_request("Category does not exist", code="products.category_not_found")

        dataUpdate = data.model_dump(exclude_unset=True)
        return await self.product_repository.update(product, dataUpdate)

    async def delete_product(self, product_id: int):
        product = await self.product_repository.get(product_id)
        if not product:
            raise not_found("Product not found", code="products.not_found")
        await self.product_repository.delete(product)
