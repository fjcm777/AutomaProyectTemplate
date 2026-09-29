from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.modules.categories.schemas import CategoryCreate, CategoryResponse
from app.modules.categories.service import get_category_service
from app.shared.responses import SuccessResponse, success


router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/", response_model=SuccessResponse[list[CategoryResponse]])
async def list_categories(db: AsyncSession = Depends(get_db)):
    # Service creation stays inside the route layer to keep module boundaries explicit.
    service = get_category_service(db)
    categories = await service.list_categories()
    return success(data=categories)


@router.post("/", response_model=SuccessResponse[CategoryResponse], status_code=status.HTTP_201_CREATED)
async def create_category(payload: CategoryCreate, db: AsyncSession = Depends(get_db)):
    service = get_category_service(db)
    category = await service.create_category(payload)
    return success(data=category, status_code=status.HTTP_201_CREATED, message="Created")
