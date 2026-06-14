from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin


class Product(TimestampMixin, Base):
    __tablename__ = "products"

    id: Mapped[int]                 = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str]               = mapped_column(String(150), index=True)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    price: Mapped[Decimal]          = mapped_column(Numeric(10, 2))
    image_url: Mapped[str | None]   = mapped_column(String(500), nullable=True)

    category_id: Mapped[int | None] = mapped_column(
        ForeignKey("categories.id"),
        nullable=True,
    )

    category = relationship("Category", back_populates="products")