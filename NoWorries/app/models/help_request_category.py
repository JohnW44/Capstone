from .db import db, environment, SCHEMA, add_prefix_for_prod

help_request_categories = db.Table(
    'help_request_categories',
    db.Model.metadata,
    db.Column('help_request_id', db.Integer, db.ForeignKey(add_prefix_for_prod('help_requests.id')), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey(add_prefix_for_prod('categories.id')), primary_key=True)
)

if environment == "production":
    help_request_categories.schema = SCHEMA