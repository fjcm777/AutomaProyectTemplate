from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.modules.categories.schemas import CategoryCreate, CategoryResponse
from app.modules.categories.service import get_category_service
from app.shared.pagination import DEFAULT_PAGE_SIZE, PaginatedResponse
from app.shared.responses import SuccessResponse, success


router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/", response_model=SuccessResponse[PaginatedResponse[CategoryResponse]])
async def list_categories(
    page: int = 1,
    page_size: int = DEFAULT_PAGE_SIZE,
    is_active: bool | None = True,
    db: AsyncSession = Depends(get_db),
):
    # Service creation stays inside the route layer to keep module boundaries explicit.
    service = get_category_service(db)
    items, total, page, page_size = await service.list_categories(page, page_size, is_active)
    return success(data={"items": items, "total": total, "page": page, "page_size": page_size})


@router.post("/", response_model=SuccessResponse[CategoryResponse], status_code=status.HTTP_201_CREATED)
async def create_category(payload: CategoryCreate, db: AsyncSession = Depends(get_db)):
    service = get_category_service(db)
    category = await service.create_category(payload)
    return success(data=category, status_code=status.HTTP_201_CREATED, message="Created")
