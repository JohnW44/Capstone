import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/categories';
import { updateHelpRequestCategories } from '../../redux/helpRequests';
import './CategoryChangeModal.css';

function CategoryChangeModal({ helpRequestId, onCategoryChange, initialCategories = [] }) {
    const dispatch = useDispatch();
    const categoriesFromStore = useSelector(state => {
        console.log("Categories from store:", state.categories);
        return state.categories;
    });
    const categories = useMemo(() => categoriesFromStore || [], [categoriesFromStore]);
    const [selectedCategories, setSelectedCategories] = useState(initialCategories);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCategories = async () => {
            setIsLoading(true);
            try {
                await dispatch(fetchCategories());
            } catch (err) {
                setError('Failed to load categories');
                console.error('Error loading categories:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadCategories();
    }, [dispatch]);

    useEffect(() => {
        console.log("Current categories:", categories);
    }, [categories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedCategories.length === 0) {
            setError('Please select at least one category');
            return;
        }

        try {
            const response = await dispatch(updateHelpRequestCategories(
                helpRequestId,
                selectedCategories
            ));

            if (response) {
                onCategoryChange();
            } else {
                setError('Failed to update categories');
            }
        } catch (err) {
            console.error('Error updating categories:', err);
            setError('An error occurred while updating categories');
        }
    };

    const handleCategoryToggle = (categoryId) => {
        console.log('Toggling category:', categoryId);
        setSelectedCategories(prev => {
            const newSelection = prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId];
            console.log('New selection:', newSelection);
            return newSelection;
        });
    };

    if (isLoading) {
        return (
            <div className="category-change-modal">
                <h2>Loading categories...</h2>
            </div>
        );
    }

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