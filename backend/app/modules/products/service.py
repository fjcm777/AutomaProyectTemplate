from app.modules.products.repository import ProductRepository
from app.modules.products.schemas import ProductCreate, ProductUpdate
from app.modules.categories.repository import CategoryRepository
from app.shared.exceptions import bad_request, not_found


class ProductService:
    """Business rules for product use cases."""

    def __init__(self, product_repository: ProductRepository, category_repository: CategoryRepository):
        self.product_repository = product_repository
        self.category_repository = category_repository

    def list_products(self):
        return self.product_repository.list()
    
    def get_product(self, product_id: int):
        product = self.product_repository.get(product_id)
        if not product:
            raise not_found("Product not found")
        return product

    
    def create_product(self, data: ProductCreate):
        # Guard FK integrity at service layer for clearer API errors.
        if data.category_id is not None:
            category = self.category_repository.get(data.category_id)
            if not category:
                raise bad_request("Category does not exist")

        return self.product_repository.create(data.model_dump())

    
    def update_product(self, product_id: int, data: ProductUpdate):
        product = self.get_product(product_id)

        if data.category_id is not None:
            category = self.category_repository.get(data.category_id)
            if not category:
                raise bad_request("Category does not exist")

        dataUpdate = data.model_dump(exclude_unset=True)
        return self.product_repository.update(product, dataUpdate)

    def delete_product(self, product_id: int):
        product = self.product_repository.get(product_id)
        if not product:
            raise not_found("Product not found")
        self.product_repository.delete(product)
