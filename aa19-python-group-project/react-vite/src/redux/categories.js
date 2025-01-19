const LOAD_CATEGORIES = 'categories/LOAD';
const ADD_CATEGORY = 'categories/ADD';
const UPDATE_CATEGORY = 'categories/UPDATE';
const REMOVE_CATEGORY = 'categories/REMOVE';

const loadCategories = (categories) => ({
    type: LOAD_CATEGORIES,
    categories
})

const addCategory = (category) => ({
    type: ADD_CATEGORY,
    category
})

const updateCategory = (category) => ({
    type: UPDATE_CATEGORY,
    category
})

const removeCategory = (categoryId) => ({
    type: REMOVE_CATEGORY,
    categoryId
})

export const fetchCategories = () => async (dispatch) => {
    const response = await fetch('/api/categories/');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadCategories(data.categories));
    }
}

export const createCategory = (categoryData) => async (dispatch) => {
    const response = await fetch('/api/categories/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(categoryData)
    });
    
    if (response.ok) {
        const data = await response.json();
        dispatch(addCategory(data));
        return data;
    }
};

export const updateUserCategory = (categoryId, categoryData) => async (dispatch) => {
    const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(categoryData)
    });
    
    if (response.ok) {
        const data = await response.json();
        dispatch(updateCategory(data));
        return data;
    }
    return null;
};

export const deleteCategory = (categoryId) => async (dispatch) => {
    const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (response.ok) {
        dispatch(removeCategory(categoryId));
        return true;
    }
    return false
};

const initialState = [];

const categoriesReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_CATEGORIES:
            return [...action.categories];
        case ADD_CATEGORY:
            return [...state, action.category];
        case UPDATE_CATEGORY:
            return state.map(category => 
                category.id === action.category.id ? action.category : category
            );
        case REMOVE_CATEGORY:
            return state.filter(category => category.id !== action.categoryId);
        default:
            return state;
    }
};

export default categoriesReducer;