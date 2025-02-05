from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Category, HelpRequest
from datetime import datetime, timezone

categories_routes = Blueprint('categories', __name__)

@categories_routes.route('/', methods=['GET'])
@login_required
def get_categories():
    """
    Get all categories (default and user-created)
    """
    categories = Category.query.all()
    return {'categories': [category.to_dict() for category in categories]}


@categories_routes.route('/<int:categoryId>', methods=['GET'],)
@login_required
def get_category(categoryId):
    """
    Get a specific category by id
    """

    category = Category.query.get(categoryId)

    if not category:
        return {'message': "Category couldn't be found"}, 404
    
    return {'category': category.to_dict()}


@categories_routes.route('/', methods=['POST'])
@login_required
def create_category():
    """
    Create a new category
    """
    data = request.json

    if not data.get('name'):
        return {
            'message': 'Validation error',
            'errors': {
                'name': ['Name is required']
            }
        }, 400
    
    existing_category = Category.query.filter_by(
        user_id=current_user.id,
        name=data.get('name')
    ).first()

    if existing_category:
        return {
            'message': 'Validation error',
            'errors': {
                'name': ['Name must be unique for this user']
            }
        }, 400
    
    new_category = Category(
        user_id=current_user.id,
        name=data.get('name'),
        description=data.get('description'),
        is_default=data.get('is_default', False),
        created_at=datetime.now(timezone.utc)
    )

    db.session.add(new_category)
    db.session.commit()

    return {
        'id': new_category.id,
        'user_id': new_category.user_id,
        'name': new_category.name,
        'description': new_category.description,
        'is_default': new_category.is_default,
        'created_at': new_category.created_at.strftime("%Y-%m-%d %H:%M:%S")
    }, 201


@categories_routes.route('/<int:categoryId>', methods=['PUT'])
@login_required
def update_category(categoryId):
    """
    Update a category
    """
    category = Category.query.get(categoryId)

    if not category:
        return {'message': "category couldn't be found"}, 404
    
    if category.is_default:
        return {'message': "Cannot modify default categories"}, 403
    
    if category.user_id != current_user.id:
        return {'message': "Forbidden"}, 403
    
    data = request.json

    if 'name' in data: 
        existing_category = category.query.filter_by(
            user_id=current_user.id,
            name=data['name']
        ).first()
        if existing_category and existing_category.id != categoryId:
            return {
                'message': 'Validation error',
                'errors': {
                    'name': ['Name must be unique for this user']
                }
            }, 400
        category.name = data['name']

    if 'description' in data:
        category.description = data['description']

    db.session.commit()

    return category.to_dict()

@categories_routes.route('/<int:categoryId>', methods=['DELETE'])
@login_required
def delete_category(categoryId):
    """
    Delete a category
    """
    category = Category.query.get(categoryId)

    if not category:
        return {'message': "Category couldn't be found "}, 404
    
    if category.is_default:
        return {'message': "Cannot delete default categories"}, 403
    
    if category.user_id != current_user.id:
        return {'message': "Forbidden"}, 403
    
    if category.help_requests:
        return {'message': "Cannot delete category that is being used by help requests"}, 400
    
    db.session.delete(category)
    db.session.commit()

    return {'message': "Successfully deleted"}