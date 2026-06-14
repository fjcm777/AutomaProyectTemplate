"""add timestamps and fix price to numeric

Revision ID: a1b2c3d4e5f6
Revises: 9715cd5dd47d
Create Date: 2026-06-02

"""
from alembic import op
import sqlalchemy as sa


revision = 'a1b2c3d4e5f6'
down_revision = '9715cd5dd47d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('categories', sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False))
    op.add_column('categories', sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False))

    op.add_column('products', sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False))
    op.add_column('products', sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False))

    op.alter_column('products', 'price',
        existing_type=sa.Float(),
        type_=sa.Numeric(precision=10, scale=2),
        existing_nullable=False,
    )


def downgrade() -> None:
    op.alter_column('products', 'price',
        existing_type=sa.Numeric(precision=10, scale=2),
        type_=sa.Float(),
        existing_nullable=False,
    )

    op.drop_column('products', 'updated_at')
    op.drop_column('products', 'created_at')
    op.drop_column('categories', 'updated_at')
    op.drop_column('categories', 'created_at')
