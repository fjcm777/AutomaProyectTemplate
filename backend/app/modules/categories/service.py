from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.categories.repository import CategoryRepository
from app.modules.categories.schemas import CategoryCreate
from app.shared.exceptions import bad_request


class CategoryService:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    async def list_categories(self):
        return await self.repository.list()

    async def get_category(self, category_id: int):
        # Public entry point for other modules; they must not touch the repository directly.
        return await self.repository.get(category_id)

    async def create_category(self, data: CategoryCreate):
        existing = await self.repository.get_by_name(data.name)
        if existing:
            raise bad_request("Category name already exists", code="categories.name_duplicate")

        return await self.repository.create(data.model_dump())


def get_category_service(db: AsyncSession) -> CategoryService:
    # Composition entry point other modules must use instead of touching CategoryRepository directly.
    return CategoryService(CategoryRepository(db))
