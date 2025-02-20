FROM python:3.9.18-alpine3.18


RUN apk add --update --no-cache \
    nodejs \
    npm \
    build-base \
    postgresql-dev \
    gcc \
    python3-dev \
    musl-dev


ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY
ARG VITE_APP_GOOGLE_MAPS_API_KEY

WORKDIR /var/www


COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install psycopg2


WORKDIR /var/www/react-vite
COPY react-vite/package*.json ./
RUN npm install
RUN npm install --save-dev typescript @types/react @types/react-dom @types/node @types/google.maps @types/react-redux @types/react-router-dom

WORKDIR /var/www
COPY . .


WORKDIR /var/www/react-vite
RUN npm run build


WORKDIR /var/www
RUN flask db upgrade
RUN flask seed all
CMD gunicorn app:app

ENV VITE_APP_GOOGLE_MAPS_API_KEY=$VITE_APP_GOOGLE_MAPS_API_KEY