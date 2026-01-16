import os

def get_database_url():
    db_url = os.environ.get('DATABASE_URL')
    if db_url:
        return db_url.replace('postgres://', 'postgresql://')
    raise RuntimeError("DATABASE_URL environment variable is not set!")

def get_secret_key():
    secret = os.environ.get('SECRET_KEY')
    if secret:
        return secret
    raise RuntimeError("SECRET_KEY environment variable is not set!")

class Config:
    SECRET_KEY = get_secret_key()
    FLASK_RUN_PORT = os.environ.get('FLASK_RUN_PORT')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = get_database_url()
    SQLALCHEMY_ECHO = True
