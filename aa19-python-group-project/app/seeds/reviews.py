from app.models import db, Review
from datetime import datetime
from sqlalchemy.sql import text
from app.models.db import environment, SCHEMA

def seed_reviews():
    review1 = Review(
        user_id=1,          
        volunteer_id=2,      
        help_request_id=1,   
        rating=5,
        comment="Marnie was very helpful with my lawn!",
        created_at=datetime.now()
    )

    review2 = Review(
        user_id=2,          
        volunteer_id=3,      
        help_request_id=2,   
        rating=4,
        comment="Bobbie helped me with my groceries, very kind!",
        created_at=datetime.now()
    )

    db.session.add(review1)
    db.session.add(review2)
    db.session.commit()

def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))
        
    db.session.commit()