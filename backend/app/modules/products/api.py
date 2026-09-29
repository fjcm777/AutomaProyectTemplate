from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.modules.products.repository import ProductRepository
from app.modules.products.schemas import ProductCreate, ProductResponse, ProductUpdate
from app.modules.products.service import ProductService

from app.modules.categories.service import get_category_service
from app.shared.pagination import DEFAULT_PAGE_SIZE, PaginatedResponse
from app.shared.responses import SuccessResponse, success


router = APIRouter(prefix="/products", tags=["products"])


def get_product_service(db: AsyncSession) -> ProductService:
    # Build dependencies here so routes stay thin and easy to test.
    return ProductService(ProductRepository(db), get_category_service(db))


@router.get("/", response_model=SuccessResponse[PaginatedResponse[ProductResponse]])
async def list_products(
    page: int = 1,
    page_size: int = DEFAULT_PAGE_SIZE,
    is_active: bool | None = True,
    db: AsyncSession = Depends(get_db),
):
    service = get_product_service(db)
    items, total, page, page_size = await service.list_products(page, page_size, is_active)
    return success(data={"items": items, "total": total, "page": page, "page_size": page_size})


@router.get("/{product_id}", response_model=SuccessResponse[ProductResponse])
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    service = get_product_service(db)
    product = await service.get_product(product_id)
    return success(data=product)


@router.post("/", response_model=SuccessResponse[ProductResponse], status_code=status.HTTP_201_CREATED)
async def create_product(payload: ProductCreate, db: AsyncSession = Depends(get_db)):
    service = get_product_service(db)
    product = await service.create_product(payload)
    return success(data=product, status_code=status.HTTP_201_CREATED, message="Created")


@router.put("/{product_id}", response_model=SuccessResponse[ProductResponse])
async def update_product(product_id: int, payload: ProductUpdate, db: AsyncSession = Depends(get_db)):
    service = get_product_service(db)
    product = await service.update_product(product_id, payload)
    return success(data=product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    service = get_product_service(db)
    await service.delete_product(product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
