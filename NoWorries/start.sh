#!/bin/sh
echo "DEBUG: SECRET_KEY is set: $(if [ -n \"$SECRET_KEY\" ]; then echo 'YES'; else echo 'NO'; fi)"
echo "DEBUG: DATABASE_URL is set: $(if [ -n \"$DATABASE_URL\" ]; then echo 'YES'; else echo 'NO'; fi)"
flask db upgrade
flask seed all
exec gunicorn app:app