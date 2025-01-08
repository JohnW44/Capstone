from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    volunteer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    help_request_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('help_requests.id')), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))

    user = db.relationship('User', foreign_keys=[user_id], back_populates='reviews_given')
    volunteer = db.relationship('User', foreign_keys=[volunteer_id], back_populates='reviews_received')
    help_request = db.relationship('HelpRequest', back_populates='review')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'volunteer_id': self.volunteer_id,
            'help_request_id': self.help_request_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }