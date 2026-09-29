from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    """Standard success envelope required by 08-api-contracts.md."""

    status_code: int
    message: str
    data: T
    warnings: list[dict] | None = None


def success(data, status_code: int = 200, message: str = "OK", warnings: list[dict] | None = None) -> dict:
    payload = {"status_code": status_code, "message": message, "data": data}
    if warnings:
        payload["warnings"] = warnings
    return payload
