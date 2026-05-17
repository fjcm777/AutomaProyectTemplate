from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.modules.categories.repository import CategoryRepository
from app.modules.categories.schemas import CategoryCreate, CategoryResponse
from app.modules.categories.service import CategoryService


router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/", response_model=list[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    # Service creation stays inside the route layer to keep module boundaries explicit.
    service = CategoryService(CategoryRepository(db))
    return service.list_categories()


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db)):
    service = CategoryService(CategoryRepository(db))
    return service.create_category(payload)
