# Capstone
# No Worries - Community Help Platform

## General Info
No Worries is a community-driven platform designed to connect seniors with neighborhood helpers. The application allows users to create and manage help requests, facilitating community support and assistance.

## Features
* User authentication (signup, login, demo user)
* Create and manage help requests
* Location-based services with Google Maps integration
* Category management for help requests
* Review system for completed help requests
* Interactive map view of help requests in the area
* Real-time location updates and management

## Technologies
Project is created with:
* Frontend:
  * React 18
  * Redux
  * Google Maps API
  * Vite
* Backend:
  * Python 3.9
  * Flask
  * SQLAlchemy
  * PostgreSQL
* Deployment:
  * Docker
  * Gunicorn

## Setup

### Prerequisites
* Python 3.9+
* Node.js
* PostgreSQL
* Google Maps API key

### Local Development
1. Clone the repository:
    ```bash
    git clone  https://github.com/JohnW44/Capstone.git
    ```
    and cd into NoWorries

2. Install dependencies

      ```bash
      pipenv install -r requirements.txt
      ```
3. Install TypeScript and frontend dependencies
      ```bash
      cd react-vite
      npm install --save-dev typescript @types/react @types/react-dom @types/node @types/google.maps @types/react-redux @types/react-router-dom
      npm i
      ```

4. Create a .env file
   ```
   FLASK_APP=app
   FLASK_ENV=development
   SECRET_KEY=<your-secret-key>
   DATABASE_URL=sqlite:///dev.db
   SCHEMA=no_worries_schema
   VITE_APP_GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
   ```

5. For the backend get into your pipenv, migrate your database, seed your database, and run your Flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

6. To run the React frontend, cd into react-vite, run `npm i` to install dependencies.

    Next run `npm run dev`

    Both servers should be running on ports 5000 for backend and 5173 for front end to view the application locally.

## Usage

### User Features

1. **Account Management**
   * Create a new account or use demo login
   * Update profile information

2. **Help Requests**
   * Create a new help request
   * Update the request
   * Delete the request
   * View other help requests in the area

3. **Location Management**
   * Add custom locations
   * Use Google Maps integration to select locations
   * Save frequently used locations
   * Delete saved locations based on User

4. **Categories**
   * Create custom categories for help requests
   * Filter requests by category
   * Manage existing categories

5. **Reviews**
   * Leave reviews for completed help requests
   * View community feedback

### Interactive Map
The application features a Google Maps integration showing:
* Active help requests in your area
* Saved locations
* Custom markers for different request types

## Project Status
Project is: in progress

Current development focuses on:
* Enhancing user experience
* Improving Help request functionality, ie a user can accept another help request
* Adding real-time notifications
* Implementing chat functionality and friend system


## Acknowledgements
* This project was inspired by David, who gave me the idea and is someone who genuinley cares  about the elderly community