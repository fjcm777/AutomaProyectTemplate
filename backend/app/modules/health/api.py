from fastapi import APIRouter

from app.shared.responses import SuccessResponse, success

router = APIRouter(tags=["health"])


@router.get("/health", response_model=SuccessResponse[dict])
async def health_check():
    return success(data={"status": "ok"})