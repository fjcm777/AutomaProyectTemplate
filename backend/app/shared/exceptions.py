class AppError(Exception):
    """Carries the standard error envelope required by 08-api-contracts.md.

    Raised from service.py; translated to a JSON response by the exception
    handlers registered in main.py.
    """

    def __init__(self, status_code: int, code: str, message: str, details: dict | None = None):
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details or {}
        super().__init__(message)


def not_found(message: str = "El recurso solicitado no existe.", code: str = "resource.not_found", details: dict | None = None) -> AppError:
    return AppError(404, code, message, details)


def bad_request(message: str = "Solicitud inválida.", code: str = "validation.invalid_input", details: dict | None = None) -> AppError:
    return AppError(400, code, message, details)
