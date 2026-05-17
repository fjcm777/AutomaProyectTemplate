from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.modules.products.repository import ProductRepository
from app.modules.products.schemas import ProductCreate, ProductResponse, ProductUpdate
from app.modules.products.service import ProductService

from app.modules.categories.repository import CategoryRepository


router = APIRouter(prefix="/products", tags=["products"])


def get_product_service(db: Session) -> ProductService:
    # Build dependencies here so routes stay thin and easy to test.
    return ProductService(ProductRepository(db), CategoryRepository(db))


@router.get("/", response_model=list[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    service = get_product_service(db)
    return service.list_products()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    service = get_product_service(db)
    return service.get_product(product_id)


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    service = get_product_service(db)
    return service.create_product(payload)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db)):
    service = get_product_service(db)
    return service.update_product(product_id, payload)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    service = get_product_service(db)
    service.delete_product(product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
