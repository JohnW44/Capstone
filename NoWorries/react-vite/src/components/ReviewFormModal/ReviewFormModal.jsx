import { useState } from 'react';
import { useModal } from '../../context/Modal';
import './ReviewFormModal.css';

function ReviewFormModal({ onReviewSubmit, initialReview = null }) {
    const [rating, setRating] = useState(initialReview?.rating || 5);
    const [comment, setComment] = useState(initialReview?.comment || '');
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!rating || !comment.trim()) {
            setErrors({
                rating: !rating && 'Rating is required',
                comment: !comment.trim() && 'Comment is required'
            });
            return;
        }

        onReviewSubmit({
            rating,
            comment: comment.trim()
        });
    };

    return (
        <div className='review-form-modal'>
            <h2>{initialReview ? 'Edit Review' : 'Leave a Review'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Rating</label>
                    <select 
                        value={rating} 
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        {[5, 4, 3, 2, 1].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                    {errors.rating && <span className="error">{errors.rating}</span>}
                </div>

                <div className="form-group">
                    <label>Comment</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        placeholder="Write your review here..."
                    />
                    {errors.comment && <span className="error">{errors.comment}</span>}
                </div>

                {errors.submit && <div className="error">{errors.submit}</div>}

                <div className="modal-buttons">
                    <button type="button" onClick={closeModal}>Cancel</button>
                    <button type="submit">Submit Review</button>
                </div>
            </form>
        </div>
    );
}

export default ReviewFormModal;