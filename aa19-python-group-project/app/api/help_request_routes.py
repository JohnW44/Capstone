from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, HelpRequest, Location, Category, User
from datetime import datetime, timezone
from sqlalchemy.orm import joinedload

help_request_routes = Blueprint('help_requests', __name__)


@help_request_routes.route('/', methods=['GET'])
def get_help_requests():
    """
    Get all help requests for current user
    """

    help_requests = HelpRequest.query.options(
        joinedload(HelpRequest.user),
        joinedload(HelpRequest.location),
        joinedload(HelpRequest.categories),
        joinedload(HelpRequest.review)
    ).all()
    
    return {'HelpRequests': [help_req.to_dict() for help_req in help_requests]}


@help_request_routes.route('/<int:requestId>', methods=['GET'])
def get_help_request(requestId):
    """
    Get help request by Id
    """
    help_request = HelpRequest.query.options(
        joinedload(HelpRequest.user),
        joinedload(HelpRequest.location),
        joinedload(HelpRequest.categories),
        joinedload(HelpRequest.review)
    ).get(requestId)

    if not help_request:
        return jsonify({"message": "Help request couldn't be found"}), 404

    return jsonify({"HelpRequest": help_request.to_dict()})


@help_request_routes.route('/', methods=['POST'])
@login_required
def create_help_request():
    """
    Creates a new help request if user is logged in
    """
    if not current_user.is_authenticated:
        return jsonify({"error": "Authentication required"}), 401

    data = request.json

    if not data.get('title') or not data.get('description') or not data.get('locationId'):
        return jsonify({"message": "Please provide all required fields"}), 400

    location = Location.query.get(data.get('locationId'))
    if not location:
        return jsonify({"message": "Location couldn't be found"}), 404

    new_request = HelpRequest(
        user_id=current_user.id,
        title=data.get('title'),
        description=data.get('description'),
        location_id=data.get('locationId'),
        status='pending',
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

    if 'categories' in data:
        for category_id in data['categories']:
            category = Category.query.get(category_id)
            if category:
                new_request.categories.append(category)

    db.session.add(new_request)
    db.session.commit()

    return jsonify({
        "message": "Help request successfully created",
        "HelpRequest": new_request.to_dict()
    }), 201


@help_request_routes.route('/<int:requestId>', methods=['PUT'])
@login_required
def update_help_request(requestId):
    """
    Updates a help request for logged in user
    """
    help_request = HelpRequest.query.get(requestId)

    if not help_request:
        return jsonify({"message": "Help request couldn't be found"}), 404

    if help_request.user_id != current_user.id:
        return jsonify({"message": "You must be the owner of this help request"}), 403

    data = request.json

    if 'title' in data:
        help_request.title = data['title']
    if 'description' in data:
        help_request.description = data['description']
    if 'locationId' in data:
        location = Location.query.get(data['locationId'])
        if not location:
            return jsonify({"message": "Location couldn't be found"}), 404
        help_request.location_id = data['locationId']
    if 'status' in data:
        help_request.status = data['status']
    if 'categories' in data:
        help_request.categories = []
        for category_id in data['categories']:
            category = Category.query.get(category_id)
            if category:
                help_request.categories.append(category)

    help_request.updated_at = datetime.now(timezone.utc)
    db.session.commit()

    return jsonify({"HelpRequest": help_request.to_dict()})


@help_request_routes.route('/<int:requestId>', methods=['DELETE'])
@login_required
def delete_help_request(requestId):
    """
    Deletes a help request if you are the owner
    """
    help_request = HelpRequest.query.get(requestId)

    if not help_request:
        return jsonify({"message": "Help request couldn't be found"}), 404

    if help_request.user_id != current_user.id:
        return jsonify({"message": "You must be the owner of this help request"}), 403

    db.session.delete(help_request)
    db.session.commit()

    return jsonify({"message": "Successfully deleted"})



