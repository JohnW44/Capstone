from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Category(db.Model):
    __tablename__ = 'categories'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    is_default = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='categories')
    help_requests = db.relationship(
        'HelpRequest',
        secondary='help_request_categories',
        back_populates='categories'
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'description': self.description,
            'is_default': self.is_default,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }