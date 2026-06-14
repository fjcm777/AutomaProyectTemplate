from typing import Generic, TypeVar

from pydantic import BaseModel

DEFAULT_LIMIT = 20
MAX_LIMIT = 100

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    limit: int
    offset: int