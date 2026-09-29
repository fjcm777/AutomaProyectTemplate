# 16 - Enforcement de límites entre módulos

Proyecto: **Automata**
Fecha de creación: 2026-09-29

## 1. Objetivo

`07-modules.md` (secciones 7 y 9) define reglas de independencia entre módulos: un módulo solo puede usar el `service.py` público de otro módulo, nunca su `repository.py` ni `models.py` directamente, y `repository.py` nunca importa `service.py`.

Esas reglas son correctas pero, escritas como texto, dependen de que cada desarrollador (o cada sesión de IA) las recuerde. Este documento define cómo se verifican **automáticamente**, para que una violación falle antes de llegar a producción, en lugar de descubrirse meses después cuando ya es difícil desenredar.

## 2. Herramienta

```text
import-linter (paquete Python, PyPI: import-linter)
```

Se eligió por ser específico para este problema (verificar reglas de arquitectura de imports en Python), no requerir infraestructura adicional, y poder correr tanto localmente como en CI.

## 3. Reglas verificadas (mapeadas a 07-modules.md)

| Regla en 07-modules.md | Contrato en `.importlinter` |
|---|---|
| Sección 9: `api.py -> service.py -> repository.py`, nunca al revés | Contrato tipo `layers`, uno por módulo |
| Sección 9: "repository.py no debe llamar a repositories de otros módulos" | Contrato tipo `forbidden`: nadie fuera del propio módulo puede importar su `repository` |
| Sección 7: "un módulo puede usar otro módulo únicamente a través de funciones públicas de su service.py" | Mismo contrato `forbidden`, extendido a `models.py` (bloquea el otro camino de acceso directo a datos ajenos) |

## 4. Ejemplo de configuración (`backend/.importlinter`)

```ini
[importlinter]
root_package = app

; --- Capas dentro de cada módulo: api -> service -> repository ---
[importlinter:contract:layers-categories]
name = categories: api -> service -> repository
type = layers
layers =
    app.modules.categories.api
    app.modules.categories.service
    app.modules.categories.repository

[importlinter:contract:layers-products]
name = products: api -> service -> repository
type = layers
layers =
    app.modules.products.api
    app.modules.products.service
    app.modules.products.repository

; --- Límite entre módulos: nadie toca el repository/models ajeno ---
[importlinter:contract:cross-module-boundary]
name = Modules cannot import another module's repository or models directly
type = forbidden
source_modules =
    app.modules.categories
    app.modules.products
forbidden_modules =
    app.modules.categories.repository
    app.modules.categories.models
    app.modules.products.repository
    app.modules.products.models
ignore_imports =
    app.modules.categories.* -> app.modules.categories.repository
    app.modules.categories.* -> app.modules.categories.models
    app.modules.products.* -> app.modules.products.repository
    app.modules.products.* -> app.modules.products.models
```

## 5. Agregar un módulo nuevo

Cada módulo nuevo (`inventory`, `sales`, `customers`, etc.) agrega, en el mismo PR que lo introduce:

```text
1. Un bloque [importlinter:contract:layers-<modulo>] copiando el patrón de arriba.
2. Su nombre en source_modules y sus dos entradas (repository, models) en forbidden_modules
   del contrato cross-module-boundary, más sus dos líneas correspondientes en ignore_imports.
```

`health` no necesita contrato de capas mientras no tenga `service.py`/`repository.py` propios.

## 6. Dónde se ejecuta (3 capas)

```text
1. Manual: `lint-imports` desde backend/, en cualquier momento durante el desarrollo.
   No depende de git ni de un commit — es solo un comando.
2. Pre-commit hook (local): se dispara automáticamente cuando CUALQUIERA corre `git commit`
   (tú o una sesión de IA que haga el commit). Si falla, el commit no se crea.
3. CI (GitHub Actions): red de seguridad final, corre en cada push/PR.
```

Aclaración importante: la capa 2 la ejecuta `git`, no la IA "por decisión propia" — es infraestructura que se activa sola. Lo que la IA sí debe hacer por decisión propia es la capa 1: correr `lint-imports` manualmente después de crear o modificar `service.py`/`repository.py` de cualquier módulo, como parte de su propio proceso de verificación, sin esperar a que llegue el momento del commit. Si el hook de la capa 2 falla en un commit, la instrucción es corregir la violación y reintentar — nunca usar `--no-verify`.

## 7. Instalación

```text
pip install -r backend/requirements-dev.txt
pre-commit install
```

Ver `SETUP_GUIDE.md` para el paso dentro del flujo de setup completo.

## 8. Reglas finales

```text
import-linter se configura en Phase 0 (base técnica), antes del primer módulo de negocio real.
Cada módulo nuevo actualiza .importlinter en el mismo PR que lo introduce.
Una violación reportada por import-linter se corrige en el código, nunca se silencia
ampliando ignore_imports sin una razón arquitectónica documentada aquí.
```
