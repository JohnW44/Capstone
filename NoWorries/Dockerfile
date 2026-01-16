FROM python:3.9.18-alpine3.18


RUN apk add --update --no-cache \
    nodejs \
    npm \
    build-base \
    postgresql-dev \
    gcc \
    python3-dev \
    musl-dev \
    dos2unix


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


WORKDIR /var/www
COPY . .


WORKDIR /var/www/react-vite
RUN npm run build


WORKDIR /var/www
COPY start.sh .
RUN dos2unix start.sh && chmod +x start.sh
CMD ["./start.sh"]

ENV VITE_APP_GOOGLE_MAPS_API_KEY=$VITE_APP_GOOGLE_MAPS_API_KEY