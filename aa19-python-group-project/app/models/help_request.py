from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class HelpRequest(db.Model):
    __tablename__ = 'help_requests'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('locations.id')), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='help_requests')
    location = db.relationship('Location', back_populates='help_requests')
    reviews = db.relationship('Review', back_populates='help_request', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'title': self.title,
            'description': self.description,
            'locationId': self.location_id,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }