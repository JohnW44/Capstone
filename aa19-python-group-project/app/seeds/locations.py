from app.models import db, Location
from datetime import datetime, timezone
from sqlalchemy.sql import text
from app.models.db import environment, SCHEMA

def seed_locations():
    locations = [
        Location(
            user_id=1, 
            name="CVS Pharmacy",
            address="3030 Grape Street, San Diego, CA 92102",
            lat=32.7271,
            lng=-117.1297,
            location_type="pharmacy",
            notes="24-hour location, has drive-through pharmacy",
            created_at=datetime.now(timezone.utc)
        ),
        Location(
            user_id=1,
            name="Whole Foods Market",
            address="711 University Ave, San Diego, CA 92103",
            lat=32.7483,
            lng=-117.1637,
            location_type="grocery",
            notes="Parking available in structure behind store",
            created_at=datetime.now(timezone.utc)
        ),
        Location(
            user_id=2,
            name="Balboa Park",
            address="1549 El Prado, San Diego, CA 92101",
            lat=32.7341,
            lng=-117.1441,
            location_type="park",
            notes="Meet at the main entrance near the fountain",
            created_at=datetime.now(timezone.utc)
        ),
        Location(
            user_id=2,
            name="Mission Beach",
            address="3000 Mission Blvd, San Diego, CA 92109",
            lat=32.7683,
            lng=-117.2516,
            location_type="beach",
            notes="Meet at the main lifeguard tower",
            created_at=datetime.now(timezone.utc)
        ),
        Location(
            user_id=3,
            name="La Jolla Library",
            address="7555 Draper Ave, La Jolla, CA 92037",
            lat=32.8472,
            lng=-117.2728,
            location_type="library",
            notes="Free parking available",
            created_at=datetime.now(timezone.utc)
        ),
        Location(
            user_id=3,
            name="Torrey Pines State Natural Reserve",
            address="12600 N Torrey Pines Rd, La Jolla, CA 92037",
            lat=32.9157,
            lng=-117.2469,
            location_type="park",
            notes="Meet at the visitor center",
            created_at=datetime.now(timezone.utc)
        )
    ]
    
    [db.session.add(location) for location in locations]
    db.session.commit()

def undo_locations():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.locations RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM locations"))
        
    db.session.commit()