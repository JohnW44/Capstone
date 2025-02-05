from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Location(db.Model):
    __tablename__ = 'locations'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    location_type = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))

    
    user = db.relationship('User', back_populates='locations')
    help_requests = db.relationship('HelpRequest', back_populates='location', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'name': self.name,
            'address': self.address,
            'lat': float(self.lat),
            'lng': float(self.lng),
            'locationType': self.location_type,
            'notes': self.notes,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }