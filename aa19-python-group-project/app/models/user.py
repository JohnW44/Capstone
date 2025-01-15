from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    help_requests = db.relationship('HelpRequest', back_populates='user', cascade='all, delete-orphan')
    reviews_given = db.relationship('Review', foreign_keys='Review.user_id', back_populates='user', cascade='all, delete-orphan')
    reviews_received = db.relationship('Review', foreign_keys='Review.volunteer_id', back_populates='volunteer', cascade='all, delete-orphan')
    locations = db.relationship('Location', back_populates='user', cascade='all, delete-orphan')
    categories = db.relationship('Category', back_populates='user', cascade='all, delete-orphan')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        """Basic user information for auth responses"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'profile_image': None  
        }

    def to_dict_detailed(self):
        """Detailed user information including relationships"""
        return {
            **self.to_dict(),
            'reviews_given': [review.to_dict() for review in self.reviews_given],
            'reviews_received': [review.to_dict() for review in self.reviews_received],
            'locations': [location.to_dict() for location in self.locations],
            'categories': [category.to_dict() for category in self.categories]
        }
