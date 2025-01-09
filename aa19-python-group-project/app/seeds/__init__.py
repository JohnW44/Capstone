from flask.cli import AppGroup
from .users import seed_users, undo_users
from .categories import seed_categories, undo_categories
from .help_requests import seed_help_requests, undo_help_requests
from .reviews import seed_reviews, undo_reviews
from .locations import seed_locations, undo_locations
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_help_requests()
        undo_users()
        undo_categories()
        undo_reviews()
        undo_locations()
    seed_users()
    seed_categories()
    seed_locations()
    seed_help_requests()
    seed_reviews()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_categories()
    undo_help_requests()
    undo_reviews()
    undo_locations()
   
