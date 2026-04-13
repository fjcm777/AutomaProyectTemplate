from sqlalchemy.orm import Session

from app.modules.categories.models import Category


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self) -> list[Category]:
        return self.db.query(Category).order_by(Category.id.desc()).all()

    def get(self, category_id: int) -> Category | None:
        return self.db.query(Category).filter(Category.id == category_id).first()

    def get_by_name(self, name: str) -> Category | None:
        return self.db.query(Category).filter(Category.name == name).first()

    def create(self, data: dict) -> Category:
        category = Category(**data)
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category