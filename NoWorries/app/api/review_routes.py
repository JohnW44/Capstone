from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Review, HelpRequest, User
from datetime import datetime, timezone

review_routes = Blueprint('reviews', __name__)

@review_routes.route('/', methods=['GET'])
def get_reviews():
    """
    Get all reviews
    """
    reviews = Review.query.all()
    return {'reviews': [review.to_dict() for review in reviews]}


@review_routes.route('/<int:reviewId>', methods=['GET'])
def get_review(reviewId):
    """
    Get a specific review by id
    """
    review = Review.query.get(reviewId)
    
    if not review:
        return {'message': "Review couldn't be found"}, 404
        
    return {'review': review.to_dict()}


@review_routes.route('/help_requests/<int:requestId>', methods=['POST'])
@login_required
def create_review(requestId):
    """
    Create a review for a help request
    """
    help_request = HelpRequest.query.get(requestId)

    if not help_request:
        return {'message': "Help request couldn't be found"}, 404
    
    existing_review = Review.query.filter_by(help_request_id=requestId).first()
    if existing_review:
        return {'message': "Review already exists for this help request"}, 400
    
    data = request.json
    if not data.get('rating') or not data.get('comment') or not data.get('volunteerId'):
        return {'message': "Please provide rating, comment, and volunteerId"}, 400
    
    if help_request.user_id != current_user.id:
        return {'message': "You must be the owner of the help request to review the volunteer"}, 403
    
    # volunteer = User.query.get(data.get('volunteerId'))
    # if not volunteer:
    #     return {'message': "Volunteer couldn't be found"}, 404
    
    new_review = Review(
        user_id=current_user.id,
        volunteer_id=current_user.id,
        help_request_id=requestId,
        rating=data.get('rating'),
        comment=data.get('comment'),
        created_at=datetime.now(timezone.utc)
    )

    db.session.add(new_review)
    db.session.commit()

    return {
        'message': "Successfully created review",
        'review' : new_review.to_dict()
    }, 201


@review_routes.route('/<int:reviewId>', methods=['PUT'])
@login_required
def update_review(reviewId):
    """
    Update a review
    """
    review = Review.query.get(reviewId)

    if not review:
        return {'message': "Review couldn't be found"}, 404
    
    if review.user_id != current_user.id:
        return {'message': "You must be the owner of this review"}, 403
    
    data = request.json

    if 'rating' in data:
        review.rating = data['rating']

    if 'comment' in data:
        review.comment = data['comment']

    db.session.commit()

    return {'review': review.to_dict()}


@review_routes.route('/<int:reviewId>', methods=['DELETE'])
@login_required
def delete_review(reviewId):
    """
    Delete a review
    """
    review = Review.query.get(reviewId)

    if not review:
        return {'message': "Review couldn't be found"}, 403
    
    db.session.delete(review)
    db.session.commit()

    return {'message': "Successfully deleted"}


@review_routes.route('/users/<int:userId>', methods=['GET'])
def get_user_reviews(userId):
    """
    Get all reviews for a specific user (as volunteer)
    """
    reviews = Review.query.filter_by(volunteer_id=userId).all()
    return {'reviews': [review.to_dict() for review in reviews]}


@review_routes.route('/help_requests/<int:requestId>', methods=['GET'])
def get_help_request_review(requestId):
    """
    Get the review for a specific help request
    """
    review = Review.query.filter_by(help_request_id=requestId).first()
    
    if not review:
        return {'message': "Review couldn't be found"}, 404
        
    return {'review': review.to_dict()}