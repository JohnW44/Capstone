# `No Worries`

## Database Schema Design

[db-schema](./images/DBSchema_Capstone.png)

## API Documentation

## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

* Request: endpoints that require authentication
* Error Response: Require authentication
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the
correct role(s) or permission(s).

* Request: endpoints that require proper authorization
* Error Response: Require proper authorization
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Forbidden"
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: /api/auth
  * Body: none

* Successful Response when there is a logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
  {
    "email": "demo@aa.io",
    "first_name": "Demo",
    "id": 1,
    "last_name": "User",
    "likes": [],
    "profile_image": "./images/place-holder-profile.png",
    "username": "Demo"
  }
    ```

* Successful Response when there is no logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": "null"
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

* Require Authentication: false
* Request
  * Method: POST
  * Route path: /api/auth/login
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "email": "demo@aa.io",
      "password": "password"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
    "email": "demo@aa.io",
    "first_name": "Demo",
    "id": 1,
    "last_name": "User",
    "likes": [],
    "profile_image": "./images/place-holder-profile.png",,
    "username": "Demo"
    }
    ```

* Error Response: Invalid credentials
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    
      {
    "email": [
        "Email provided not found."
    ],
    "password": [
        "No such user exists."
    ]
    }
    ```

* Error response: Body validation errors
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Unauthorized",
      "errors": {
        "email": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Log out a User
Logs out current User
* Require Authentication: True
* Request
  * Method: POST
  * Route path: /api/auth/logout
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User logged out",
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current
user's information.

* Require Authentication: false
* Request
  * Method: POST
  * Route path: /api/auth/signup
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "first_name": "John",
      "last_name": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
    "email": "john.smith@gmail.com",
    "first_name": "John",
    "id": 7,
    "last_name": "Smith",
    "likes": [],
    "profile_image": null,
    "username": "JohnSmith"
    }
    
    ```

* Error response: User already exists with the specified email or username
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
    "errors": {
        "email": [
            "Email address is already in use."
        ],
        "username": [
            "Username is already in use."
        ]
    }
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request", 
      "errors": {
        "email": "Please provide valid email",
        "username": "Username is required",
        "firstName": "First Name is required",
        "lastName": "Last Name is required"
      }
    }
    ```

### HELP REQUESTS


### Get all Requests


Returns all Help Requests.


* Require Authentication: true
* Request
  * Method: GET
  * Route path: api/help-requests
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
        "help_requests": [
            {
                "id": 1,
                "userId": 1,
                "title": "Grocery Shopping Help",
                "description": "Need help with weekly shopping",
                "locationId": 1,
                "status": "pending",
                "created_at": "2025-01-07 10:00:00"
            }
        ]
    
    ```




### Get a specific help request from an id


Returns details of a specific help request.


* Require Authentication: true
* Request
  * Method: GET
  * Route path: api/help-requests/:requestsId
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
        "id": 1,
        "userId": 1,
        "title": "Grocery Shopping Help",
        "description": "Need help with weekly shopping",
        "locationId": 1,
        "status": "pending",
        "created_at": "2025-01-07 10:00:00",
        "location": {
            "name": "Food Bowl",
            "address": "123 Food St"
        }
    }
    ```


* Error response: Couldn't find a help-request with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "error": "Help request couldn't be found"
    }
    ```


### ADD NEW HELP REQUEST


Creates a new help request when a user is signed in


* Require Authentication: true
* Request
  * Method: POST
  * Route path: api/help-requests
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
     {
        "title": "Grocery Shopping Help",
        "description": "Need help with weekly shopping",
        "locationId": 1
    }
    ```


* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:


  ```json
  {
        "id": 1,
        "userId": 1,
        "title": "Grocery Shopping Help",
        "description": "Need help with weekly shopping",
        "locationId": 1,
        "status": "pending",
        "created_at": "2025-01-07 10:00:00"
  }
    ```


* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
 
     {
        "title": "title is required",
        "description": "description of help required",
        "locationId": "location is required",
     }
  ```


### UPDATE A REQUEST


Updates an existing request for help.


* Require Authentication: true
* Require proper authorization: Request must belong to the current user
* Request
  * Method: PUT
  * Route path: api/help-requests/:requestId
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
      {
         "title": "Updated Title",
         "description": "Updated description",
         "locationId": 2
      }
    ```


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
  {
        "id": 1,
        "userId": 1,
        "title": "Updated Title",
        "description": "Updated description",
        "locationId": 2,
        "status": "pending",
        "created_at": "2025-01-07 10:00:00"
  }
    ```


* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
   {
    "error": "{object} cannot be empty"
   }
    ```
* Error response: User not authorized to delete request
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Unauthorized"
    }
    ```


* Error response: Couldn't find a Request with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Help request couldn't be found"
    }
    ```


### Delete a Help Request


Deletes an existing help request.


* Require Authentication: true
* Require proper authorization: Help request must belong to the current user
* Request
  * Method: DELETE
  * Route path: api/help-request/:requestId
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Help Request Successfully deleted"
    }
    ```


* Error response: Couldn't find a request with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Help Request couldn't be found"
    }
    ```


* Error response: User not authorized to delete help request
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Unauthorized"
    }
    ```

### REVIEWS


### Create a Review


Creates a review for a completed help request.


* Require Authentication: true
* Request
  * Method: POST
  * Route path: /api/help-requests/:requestId/reviews
  * Body:
  ```json
  {
    "rating": 5,
    "comment": "Very helpful volunteer!",
    "volunteer_id": 1
  }
  ```


* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "id": 1,
      "user_id": 1,
      "volunteer_id": 1,
      "help_request_id": 1,
      "rating": 5,
      "comment": "Very helpful volunteer!",
      "created_at": "2025-01-07 10:00:00"
    }
    ```


* Error response: Please enter all required fields
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Validation error",
      "errors": {
        "rating": ["Rating is required", "Rating must be between 1 and 5"],
        "volunteer_id": ["Volunteer ID is required"],
        "comment": ["Comment is required"]
      }
    }
   ```


* Error Response: Help request not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Help request couldn't be found"
    }
    ```   


* Error Response: Unauthorized
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Authentication required"
    }
    ```

### Get all Reviews for a User


Returns all reviews created by the current user.


* Require Authentication: true
* Request
  * Method: GET
  * Route path: /api/reviews
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
     {
      "Reviews": [
        {
          "id": 1,
          "user_id": 1,
          "volunteer_id": 1,
          "help_request_id": 1,
          "rating": 5,
          "comment": "Very helpful volunteer!",
          "created_at": "2025-01-07 10:00:00"
        }
      ]
    }
    ```


### Get a Specific Review


Returns details of a specific review.


* Require Authentication: true
* Request
  * Method: GET
  * Route path: api/reviews/:reviewId
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
   
    {
      "id": 1,
      "user_id": 1,
      "volunteer_id": 1,
      "help_request_id": 1,
      "rating": 5,
      "comment": "Very helpful volunteer!",
      "created_at": "2025-01-07 10:00:00"
    }
    ```


* Error response: Review not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "message": "Review couldn't be found"
    }
    ```


 ### Update a Review


Updates an existing review.


* Require Authentication: true
* Require proper authorization: Review must belong to the current user
* Request
  * Method: PUT
  * Route path: api/reviews/:reviewId
  * Body:
    ```json
    {
      "rating": 4,
      "comment": "Updated review comment"
    }


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
      "id": 1,
      "user_id": 1,
      "volunteer_id": 1,
      "help_request_id": 1,
      "rating": 4,
      "comment": "Updated review comment",
      "created_at": "2025-01-07 10:00:00"
    }
    ```


  * Error Response: Review not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Review couldn't be found"
    }
    ```


### Delete a Review


Deletes an existing review.


* Require Authentication: True
* Require proper authorization: Review must belong to the current user
* Request
  * Method: DELETE
  * Route path: api/reviews/:reviewId
  * Body: none


* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:


    ```json
    {
        "message": "Review Successfully delted"
    }


    ```

* Error Response: Review not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Review couldn't be found"
    }

    ```

### SAVED LOCATIONS

### Create a Saved Location

Creates a new saved location for the current user.

* Require Authentication: true
* Request
  * Method: POST
  * Route path: /api/locations
  * Body:
    ```json
    {
      "name": "CVS",
      "address": "3030 Grape Street",
      "lat": 32.727,
      "lng": -117.129,
      "locationType": "pharmacy",
      "notes": "Enter through side door, ask for Bob Bobo"
    }

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "id": 1,
      "user_id": 1,
      "name": "CVS",
      "address": "3030 Grape Street",
      "lat": 32.727,
      "lng": -117.129,
      "locationType": "pharmacy",
      "notes": "Enter through side door, ask for Bob Bobo",
      "created_at": "2025-01-07 10:00:00"
    }

* Error Response: Validation error
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Validation error",
      "errors": {
        "name": ["Name is required"],
        "address": ["Address is required"],
        "lat": ["Latitude is required", "Must be a valid coordinate"],
        "lng": ["Longitude is required", "Must be a valid coordinate"],
        "locationType": ["Location type is required"]
      }
    }
    ```

### Get All Saved Locations

Returns all saved locations for the current user.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: /api/locations
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "locations": [
        {
          "id": 1,
          "user_id": 1,
          "name": "CVS",
          "address": "3030 grape Street",
          "lat": 32.727,
          "lng": -117.129,
          "locationType": "pharmacy",
          "notes": "Enter through side door, ask for Bob Bobo",
          "created_at": "2025-01-07 10:00:00"
        }
      ]
    }
    ```

### Get a Specific Location

Returns details of a specific saved location.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: /api/locations/:locationId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "id": 1,
      "user_id": 1,
      "name": "CVS",
      "address": "3030 Grape Street",
      "lat": 32.727,
      "lng": -117.129,
      "locationType": "pharmacy",
      "notes": "Enter through side door, ask for Bob Bobo",
      "created_at": "2025-01-07 10:00:00"
    }
    ```

* Error Response: Location not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Location couldn't be found"
    }
    ```
    
### Update a Location

Updates an existing saved location.

* Require Authentication: true
* Require proper authorization: Location must belong to the current user
* Request
  * Method: PUT
  * Route path: /api/locations/:locationId
  * Body:
    ```json
    {
      "name": "Walgreens",
      "address": "3029 University Ave",
      "lat": 32.74917,
      "lng": -117.12925,
      "locationType": "pharmacy",
      "notes": "Updated notes"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "id": 1,
      "user_id": 1,
      "name": "Walgreens",
      "address": "3029 University Ave",
      "lat": 32.74917,
      "lng": -117.12925,
      "locationType": "pharmacy",
      "notes": "Updated notes",
      "created_at": "2025-01-07 10:00:00"
    }
    ```
* Error Response: Location not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Location couldn't be found"
    }
    ```

* Error Response: Unauthorized
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Forbidden"
    }
    ```
### Delete a Location

Deletes an existing saved location.

* Require Authentication: true
* Require proper authorization: Location must belong to the current user
* Request
  * Method: DELETE
  * Route path: /api/locations/:locationId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Successfully deleted"
    }
    ```

* Error Response: Location not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Location couldn't be found"
    }
    ```

* Error Response: Unauthorized
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Forbidden"
    }
    ```


### CATEGORIES


### Get All Categories

Returns all categories (both default and user-created).

* Require Authentication: true
* Request
  * Method: GET
  * Route path: /api/categories
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "categories": [
        {
          "id": 1,
          "user_id": null,
          "name": "Medical Transport",
          "description": "Transportation to medical appointments",
          "is_default": true,
          "created_at": "2025-01-07 10:00:00"
        },
        {
          "id": 2,
          "user_id": 1,
          "name": "Grocery Shopping",
          "description": "Help with shopping for groceries",
          "is_default": false,
          "created_at": "2025-01-07 10:00:00"
        }
      ]
    }
    ```

### Get a Specific Category

Returns details of a specific category.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: /api/categories/:categoryId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "id": 1,
      "user_id": 1,
      "name": "Grocery Shopping",
      "description": "Help with shopping for groceries",
      "is_default": false,
      "created_at": "2025-01-07 10:00:00"
    }
    ```

* Error Response: Category not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Category couldn't be found"
    }
    ```    

### Create a Category

Creates a new category for help requests.

* Require Authentication: true
* Request
  * Method: POST
  * Route path: /api/categories
  * Body:
    ```json
    {
      "name": "Grocery Shopping",
      "description": "Help with shopping for groceries and carrying them home",
      "is_default": false
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "id": 1,
      "user_id": 1,
      "name": "Grocery Shopping",
      "description": "Help with shopping for groceries and carrying them home",
      "is_default": false,
      "created_at": "2025-01-07 10:00:00"
    }
    ```

* Error Response: Validation error
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Validation error",
      "errors": {
        "name": ["Name is required", "Name must be unique for this user"]
      }
    }
    ```

### Update a Category

Updates an existing category.

* Require Authentication: true
* Require proper authorization: Category must belong to the current user
* Request
  * Method: PUT
  * Route path: /api/categories/:categoryId
  * Body:
    ```json
    {
      "name": "Updated Category Name",
      "description": "Updated description"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "id": 1,
      "user_id": 1,
      "name": "Updated Category Name",
      "description": "Updated description",
      "is_default": false,
      "created_at": "2025-01-07 10:00:00"
    }
    ```

* Error Response: Cannot modify default category
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Cannot modify default categories"
    }
    ```

* Error Response: Category not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Category couldn't be found"
    }
    ```

### Delete a Category

Deletes an existing category.

* Require Authentication: true
* Require proper authorization: Category must belong to the current user
* Request
  * Method: DELETE
  * Route path: /api/categories/:categoryId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Successfully deleted"
    }
    ```

* Error Response: Cannot delete default category
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Cannot delete default categories"
    }
    ```

* Error Response: Category not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Category couldn't be found"
    }
    ```

* Error Response: Category in use
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Cannot delete category that is being used by help requests"
    }