from app.models import db, HelpRequest, Category
from datetime import datetime, timezone
from sqlalchemy.sql import text
from app.models.db import environment, SCHEMA

def seed_help_requests():
    help_request1 = HelpRequest(
        user_id=1,
        title="Need someone to mow the lawn",
        description="Looking for someone to mow my lawn this week",
        location_id=1,
        status="pending",
        created_at=datetime.now(timezone.utc)
    )

    help_request2 = HelpRequest(
        user_id=2, 
        title="Grocery shopping assistance needed",
        description="Need help picking up groceries, I have a detailed list ready",
        location_id=2, 
        status="pending",
        created_at=datetime.now(timezone.utc)
    )

    help_request3 = HelpRequest(
        user_id=3,
        title="Help with computer setup",
        description="Need assistance setting up my new laptop",
        location_id=3,
        status="pending",
        created_at=datetime.now(timezone.utc)
    )

    help_request4 = HelpRequest(
        user_id=1,
        title="Dog walking assistance",
        description="Need someone to walk my dog this weekend",
        location_id=4,
        status="completed",
        created_at=datetime.now(timezone.utc)
    )

    yard_work = Category.query.filter_by(name="Yard Work").first()
    grocery = Category.query.filter_by(name="Grocery Shopping").first()
    tech_support = Category.query.filter_by(name="Tech Support").first()
    pet_care = Category.query.filter_by(name="Pet Care").first()

    help_request1.categories.append(yard_work)
    help_request2.categories.append(grocery)
    help_request3.categories.append(tech_support)
    help_request4.categories.append(pet_care)

    db.session.add(help_request1)
    db.session.add(help_request2)
    db.session.add(help_request3)
    db.session.add(help_request4)
    db.session.commit()

def undo_help_requests():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.help_requests RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM help_requests"))
        
    db.session.commit()