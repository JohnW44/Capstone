import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory } from '../../redux/categories';
import { updateHelpRequestCategories } from '../../redux/helpRequests';
import './CategoryChangeModal.css';

function CategoryChangeModal({ helpRequestId, onCategoryChange, initialCategories = [] }) {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.categories);
    const [selectedCategories, setSelectedCategories] = useState(initialCategories);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        const response = await dispatch(createCategory({
            name: newCategoryName.trim(),
            description: 'Custom category'
        }));

        if (response) {
            setSelectedCategories(prev => [...prev, response.id]);
            setNewCategoryName('');
            dispatch(fetchCategories());
        }
    };

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

    return (
        <div className="category-change-modal">
            <h2>Change Categories</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                {/* Add category input */}
                <div className="add-category-form">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="New category name"
                        className="new-category-input"
                    />
                    <button 
                        type="button"
                        onClick={handleAddCategory}
                        className="add-category-btn"
                    >
                        Add
                    </button>
                </div>

                <div className="category-list">
                    {categories.map(category => (
                        <label key={category.id} className="category-item">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.id)}
                                onChange={() => {
                                    setSelectedCategories(prev => 
                                        prev.includes(category.id)
                                            ? prev.filter(id => id !== category.id)
                                            : [...prev, category.id]
                                    );
                                }}
                            />
                            <div className="category-info">
                                <span className="category-name">{category.name}</span>
                                {category.description && (
                                    <span className="category-description">{category.description}</span>
                                )}
                            </div>
                        </label>
                    ))}
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