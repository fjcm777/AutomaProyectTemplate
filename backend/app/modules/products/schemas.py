from pydantic import BaseModel

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category_id: int
    image_url: str | None = None

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int

    model_config = {"from_attributes": True}

class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    category_id: int | None = None
    image_url: str | None = None