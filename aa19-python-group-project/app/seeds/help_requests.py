from app.models import db, HelpRequest
from datetime import datetime
from sqlalchemy.sql import text
from app.models.db import environment, SCHEMA

def seed_help_requests():
    help_request1 = HelpRequest(
        user_id=1,
        title="Need someone to mow the lawn",
        description="Looking for someone to mow my lawn this week",
        location_id=1,
        status="pending",
        created_at=datetime.now()
    )

    help_request2 = HelpRequest(
        user_id=2, 
        title="Grocery shopping assistance needed",
        description="Need help picking up groceries, I have a detailed list ready",
        location_id=2, 
        status="pending",
        created_at=datetime.now()
    )


    db.session.add(help_request1)
    db.session.add(help_request2)
    db.session.commit()

def undo_help_requests():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.help_requests RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM help_requests"))
        
    db.session.commit()