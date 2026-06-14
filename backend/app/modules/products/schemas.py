from decimal import Decimal

from pydantic import BaseModel, field_serializer


class ProductBase(BaseModel):
    name: str
    description: str
    price: Decimal
    category_id: int
    image_url: str | None = None

    @field_serializer("price")
    def serialize_price(self, value: Decimal) -> float:
        return float(value)


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int

    model_config = {"from_attributes": True}


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: Decimal | None = None
    category_id: int | None = None
    image_url: str | None = None

    @field_serializer("price")
    def serialize_price(self, value: Decimal | None) -> float | None:
        return float(value) if value is not None else None