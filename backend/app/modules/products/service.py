from app.modules.products.repository import ProductRepository
from app.modules.products.schemas import ProductCreate, ProductUpdate
from app.modules.categories.service import CategoryService
from app.shared.exceptions import bad_request, not_found
from app.shared.pagination import DEFAULT_PAGE_SIZE, clamp_page, clamp_page_size


class ProductService:
    """Business rules for product use cases."""

    def __init__(self, product_repository: ProductRepository, category_service: CategoryService):
        self.product_repository = product_repository
        self.category_service = category_service

    async def list_products(self, page: int = 1, page_size: int = DEFAULT_PAGE_SIZE, is_active: bool | None = True):
        page = clamp_page(page)
        page_size = clamp_page_size(page_size)
        items, total = await self.product_repository.list(page, page_size, is_active)
        return items, total, page, page_size

    async def get_product(self, product_id: int):
        product = await self.product_repository.get(product_id)
        if not product:
            raise not_found("Product not found", code="products.not_found", details={"resource": "product", "id": product_id})
        return product

    async def create_product(self, data: ProductCreate):
        # Guard FK integrity at service layer for clearer API errors.
        if data.category_id is not None:
            category = await self.category_service.get_category(data.category_id)
            if not category:
                raise bad_request(
                    "Category does not exist",
                    code="products.category_not_found",
                    details={"resource": "category", "id": data.category_id},
                )

        return await self.product_repository.create(data.model_dump())

    async def update_product(self, product_id: int, data: ProductUpdate):
        product = await self.get_product(product_id)

        if data.category_id is not None:
            category = await self.category_service.get_category(data.category_id)
            if not category:
                raise bad_request(
                    "Category does not exist",
                    code="products.category_not_found",
                    details={"resource": "category", "id": data.category_id},
                )

        dataUpdate = data.model_dump(exclude_unset=True)
        return await self.product_repository.update(product, dataUpdate)

    async def delete_product(self, product_id: int):
        # Logical delete: 08-api-contracts.md requires DELETE to deactivate, not remove the row.
        product = await self.product_repository.get(product_id)
        if not product:
            raise not_found("Product not found", code="products.not_found", details={"resource": "product", "id": product_id})
        await self.product_repository.deactivate(product)
