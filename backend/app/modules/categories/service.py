from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.categories.repository import CategoryRepository
from app.modules.categories.schemas import CategoryCreate
from app.shared.exceptions import bad_request
from app.shared.pagination import DEFAULT_PAGE_SIZE, clamp_page, clamp_page_size


class CategoryService:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    async def list_categories(self, page: int = 1, page_size: int = DEFAULT_PAGE_SIZE, is_active: bool | None = True):
        page = clamp_page(page)
        page_size = clamp_page_size(page_size)
        items, total = await self.repository.list(page, page_size, is_active)
        return items, total, page, page_size

    async def get_category(self, category_id: int):
        # Public entry point for other modules; they must not touch the repository directly.
        return await self.repository.get(category_id)

    async def create_category(self, data: CategoryCreate):
        existing = await self.repository.get_by_name(data.name)
        if existing:
            raise bad_request(
                "Category name already exists",
                code="categories.name_duplicate",
                details={"resource": "category", "name": data.name},
            )

        return await self.repository.create(data.model_dump())


def get_category_service(db: AsyncSession) -> CategoryService:
    # Composition entry point other modules must use instead of touching CategoryRepository directly.
    return CategoryService(CategoryRepository(db))
