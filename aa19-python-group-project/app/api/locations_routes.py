from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Location, HelpRequest
from datetime import datetime, timezone

location_routes = Blueprint('locations', __name__)

@location_routes.route('/', methods=['GET'])
@login_required
def get_locations():
    """
    Get all locations for current user
    """
    locations = Location.query.filter_by(user_id=current_user.id).all()
    return {'locations': [location.to_dict() for location in locations]}


@location_routes.route('/<int:locationId>', methods=['GET'])
@login_required
def get_location(locationId):
    """
    Get a specific loaction by id
    """

    location = Location.query.get(locationId)

    if not location:
        return {'message': "Location couldn't be found"}, 404
    
    if location.user_id != current_user.id:
        return {'messagte': "Forbidden"}, 403
    
    return {'location': location.to_dict()}


@location_routes.route('/', methods=['POST'])
@login_required
def create_location():
    """
    Create a new location
    """

    data = request.json
    required_fields = ['name', 'address', 'lat', 'lng', 'location_type']
    errors = {field: ['This field is required'] for field in required_fields if not data.get(field)}

    if errors:
        return {
            'message': 'Validation Error',
            'errors': errors
        }, 400
    
    new_location = Location(
        user_id=current_user.id,
        name=data.get('name'),
        address=data.get('address'),
        lat=data.get('lat'),
        lng=data.get('lng'),
        location_type=data.get('location_type'),
        notes=data.get('notes'),
        created_at=datetime.now(timezone.utc)
    )

    db.session.add(new_location)
    db.session.commit()

    return {'location': new_location.to_dict()}, 201


@location_routes.route('/<int:locationId>', methods=['PUT'])
@login_required
def update_location(locationId):
    """
    Update a location
    """
    location = Location.query.get(locationId)

    if not location:
        return {'message': "Location couldn't be found"}, 404
    
    if location.user_id != current_user.id:
        return {'message': 'Forbiddden'}, 403
    
    data = request.json

    if location.help_requests and (data.get('lat') or data.get('lng') or data.get('address')):
        return {'message': "Cannot modify address of location with associated help requests"}, 403
    
    if 'name' in data:
        location.name = data['name']

    if 'address' in data:
        location.address = data['address']

    if 'lat' in data:
        location.lat = data['lat']

    if 'lng' in data:
        location.lng = data['lng']

    if 'location_type' in data:
        location.location_type = data['location_type']

    if 'notes' in data:
        location.notes = data['notes']

    db.session.commit()

    return {'location': location.to_dict()}


@location_routes.route('/<int:locationId>', methods=['DELETE'])
@login_required
def delete_location(locationId):
    """
    Delete a location
    """
    location = Location.query.get(locationId)

    if not location:
        return {'message': "Location couldn't be found"}, 404
    
    if location.user_id != current_user.id:
        return {'message': 'Forbidden'}, 403
    
    if location.help_requests:
        return {'message': "Cannot delete location that has associated help requests"}, 400
    
    db.session.delete(location)
    db.session.commit()

    return {'message': 'Successfully deleted'}