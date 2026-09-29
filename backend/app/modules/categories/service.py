from sqlalchemy.orm import Session

from app.modules.categories.repository import CategoryRepository
from app.modules.categories.schemas import CategoryCreate
from app.shared.exceptions import bad_request


class CategoryService:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    def list_categories(self):
        return self.repository.list()

    def get_category(self, category_id: int):
        # Public entry point for other modules; they must not touch the repository directly.
        return self.repository.get(category_id)

    def create_category(self, data: CategoryCreate):
        existing = self.repository.get_by_name(data.name)
        if existing:
            raise bad_request("Category name already exists")

        return self.repository.create(data.model_dump())


def get_category_service(db: Session) -> CategoryService:
    # Composition entry point other modules must use instead of touching CategoryRepository directly.
    return CategoryService(CategoryRepository(db))