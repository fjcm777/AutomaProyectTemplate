"""FastAPI entrypoint for the template project.

This file only composes global concerns (middleware, routers, app metadata).
Business logic should stay inside each module (`modules/*`).
"""

import uuid

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.modules.health.api import router as health_router
from app.modules.categories.api import router as categories_router
from app.modules.products.api import router as products_router
from app.shared.exceptions import AppError


app = FastAPI(title=settings.APP_NAME)

# Global middleware shared by every endpoint.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Standard error envelope required by 08-api-contracts.md / 11-error-handling.md.
@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status_code": exc.status_code,
            "code": exc.code,
            "message": exc.message,
            "details": exc.details,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={
            "status_code": 422,
            "code": "validation.invalid_input",
            "message": "Hay campos inválidos. Revise la información ingresada.",
            "details": {"errors": exc.errors()},
        },
    )


@app.exception_handler(Exception)
async def internal_error_handler(request: Request, exc: Exception) -> JSONResponse:
    trace_id = str(uuid.uuid4())
    return JSONResponse(
        status_code=500,
        content={
            "status_code": 500,
            "code": "system.internal_error",
            "message": "Ocurrió un error inesperado.",
            "details": {"trace_id": trace_id},
        },
    )

# Feature routers are mounted under the configured API prefix.
app.include_router(health_router, prefix=settings.API_V1_PREFIX)
app.include_router(categories_router, prefix=settings.API_V1_PREFIX)
app.include_router(products_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
    return {"message": "Store API running"}


