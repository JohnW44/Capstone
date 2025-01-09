from app.models import db, Category
from datetime import datetime, timezone
from sqlalchemy.sql import text
from app.models.db import environment, SCHEMA

def seed_categories():
    #Default categories
    medical = Category(
        user_id=None,
        name="Medical Assistance",
        description="Help with medical appointments, pharmacy runs, or basic medical needs",
        is_default=True,
        created_at=datetime.now(timezone.utc)
    )

    transportation = Category(
        user_id=None,
        name="Transportation",
        description="Help with rides to appointments, errands, or essential services",
        is_default=True,
        created_at=datetime.now(timezone.utc)
    )

    household = Category(
        user_id=None,
        name="Household Tasks",
        description="Assistance with cleaning, organizing, or basic home maintenance",
        is_default=True,
        created_at=datetime.now(timezone.utc)
    )

    grocery = Category(
        user_id=None,
        name="Grocery Shopping",
        description="Help with shopping for groceries or essential items",
        is_default=True,
        created_at=datetime.now(timezone.utc)
    )

    yard_work = Category(
        user_id=None,
        name="Yard Work",
        description="Help with lawn maintenance, gardening, or outdoor tasks",
        is_default=True,
        created_at=datetime.now(timezone.utc)
    )
#User Categories

    pet_care = Category(
        user_id=1, 
        name="Pet Care",
        description="Help with walking dogs, feeding pets, or basic pet care",
        is_default=False,
        created_at=datetime.now(timezone.utc)
    )

    tech_support = Category(
        user_id=2,  
        name="Tech Support",
        description="Assistance with computers, phones, or other technology",
        is_default=False,
        created_at=datetime.now(timezone.utc)
    )

    categories = [
        medical,
        transportation,
        household,
        grocery,
        yard_work,
        pet_care,
        tech_support,
    ]

    [db.session.add(category) for category in categories]
    db.session.commit()

def undo_categories():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.categories RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM categories"))
        
    db.session.commit()