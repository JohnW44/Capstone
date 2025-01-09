from app.models import db, Location
from datetime import datetime
from sqlalchemy.sql import text
from app.models.db import environment, SCHEMA

def seed_locations():
    
    cvs = Location(
        user_id=1, 
        name="CVS Pharmacy",
        address="3030 Grape Street, San Diego, CA 92102",
        lat=32.7271,
        lng=-117.1297,
        location_type="pharmacy",
        notes="24-hour location, has drive-through pharmacy",
        created_at=datetime.now()
    )

    grocery = Location(
        user_id=1,
        name="Whole Foods Market",
        address="711 University Ave, San Diego, CA 92103",
        lat=32.7483,
        lng=-117.1637,
        location_type="grocery",
        notes="Parking available in structure behind store",
        created_at=datetime.now()
    )

    locations = [cvs, grocery]
    
    [db.session.add(location) for location in locations]
    db.session.commit()

def undo_locations():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.locations RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM locations"))
        
    db.session.commit()