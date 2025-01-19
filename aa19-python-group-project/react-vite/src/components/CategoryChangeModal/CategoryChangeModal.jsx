import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/categories';
import { updateHelpRequestCategories } from '../../redux/helpRequests';
import './CategoryChangeModal.css';

function CategoryChangeModal({ helpRequestId, onCategoryChange, initialCategories = [] }) {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.categories);
    const [selectedCategories, setSelectedCategories] = useState(initialCategories);
    const [error, setError] = useState(null);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedCategories.length === 0) {
            setError('Please select at least one category');
            return;
        }

        const response = await dispatch(updateHelpRequestCategories(
            helpRequestId,
            selectedCategories
        ));

        if (response) {
            onCategoryChange();
        } else {
            setError('Failed to update categories');
        }
    };

    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories(prev => {
            const newSelection = prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId];
            return newSelection;
        });
    };

    return (
        <div className="category-change-modal">
            <h2>Change Categories</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="category-list">
                    {categories.length === 0 ? (
                        <p>No categories available</p>
                    ) : (
                        categories.map(category => (
                            <label key={category.id} className="category-item">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => handleCategoryToggle(category.id)}
                                />
                                <div className="category-info">
                                    <span className="category-name">{category.name}</span>
                                    {category.description && (
                                        <span className="category-description">{category.description}</span>
                                    )}
                                </div>
                            </label>
                        ))
                    )}
                </div>

                <div className="modal-buttons">
                    <button type="submit" disabled={selectedCategories.length === 0}>
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CategoryChangeModal;