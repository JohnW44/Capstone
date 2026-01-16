#!/bin/sh
export SECRET_KEY
export DATABASE_URL
export FLASK_APP
export FLASK_ENV
export SCHEMA

echo "DEBUG: SECRET_KEY is set: $(if [ -n \"$SECRET_KEY\" ]; then echo 'YES'; else echo 'NO'; fi)"
echo "DEBUG from Python:"
python -c "import os; print('SECRET_KEY:', 'SET' if os.environ.get('SECRET_KEY') else 'NOT SET')"

flask db upgrade
flask seed all
exec gunicorn app:app