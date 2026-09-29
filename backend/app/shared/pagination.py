from typing import Generic, TypeVar

from pydantic import BaseModel

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """Shape required by 08-api-contracts.md #2.3 for paginated list responses."""

    items: list[T]
    total: int
    page: int
    page_size: int


def clamp_page_size(page_size: int) -> int:
    return max(1, min(page_size, MAX_PAGE_SIZE))


def clamp_page(page: int) -> int:
    return max(1, page)