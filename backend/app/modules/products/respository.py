from sqlalchemy.orm import Session

from app.modules.products.models import Product

class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self) -> list[Product]:
        return self.db.query(Product).order_by(Product.id.desc()).all()

    def get(self, product_id: int) -> Product | None:
        return self.db.query(Product).filter(Product.id == product_id).first()

    def create(self, data: dict) -> Product:
        product = Product(**data)
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product
    
    def update(self, product: Product, data: dict) -> Product:
        for key, value in data.items():
            setattr(product, key, value)
        self.db.commit()
        self.db.refresh(product)
        return product
    
    def delete(self, product: Product) -> None:
        self.db.delete(product)
        self.db.commit()