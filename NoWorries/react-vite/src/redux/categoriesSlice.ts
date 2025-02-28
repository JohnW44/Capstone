import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RiAspectRatioLine } from 'react-icons/ri';
import { Category, CategoriesState } from 'types/types';


// const LOAD_CATEGORIES = 'categories/LOAD';
// const ADD_CATEGORY = 'categories/ADD';
// const UPDATE_CATEGORY = 'categories/UPDATE';
// const REMOVE_CATEGORY = 'categories/REMOVE';

// const loadCategories = (categories) => ({
//     type: LOAD_CATEGORIES,
//     categories
// })

// const addCategory = (category) => ({
//     type: ADD_CATEGORY,
//     category
// })

// const updateCategory = (category) => ({
//     type: UPDATE_CATEGORY,
//     category
// })

// const removeCategory = (categoryId) => ({
//     type: REMOVE_CATEGORY,
//     categoryId
// })

// export const fetchCategories = () => async (dispatch) => {
//     const response = await fetch('/api/categories/');
//     if (response.ok) {
//         const data = await response.json();
//         dispatch(loadCategories(data.categories));
//     }
// }

export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async () => {
        const response = await fetch('/api/categories/', {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            return data.categories;
        }
        return [];
    }
)

export const fetchCategory = createAsyncThunk(
    'categories/fetchOne',
    async (categoryId: number) => {
        const response = await fetch(`/api/categories/${categoryId}`, {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            return data.category;
        }
        return null;
    }
)

interface CreateCategoryData {
    name: string;
    description: string;
    is_default?: boolean; 
}

export const createCategory = createAsyncThunk(
    '/categories/create',
    async (categoryData: CreateCategoryData, { rejectWithValue }) => {
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(categoryData)
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else if (response.status < 500) {
            const errorData = await response.json();
            return rejectWithValue(errorData);
        } else {
            return rejectWithValue({ message: 'Server error'})
        }
    }
);

// export const createCategory = (categoryData) => async (dispatch) => {
//     const response = await fetch('/api/categories/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(categoryData)
//     });
    
//     if (response.ok) {
//         const data = await response.json();
//         dispatch(addCategory(data));
//         return data;
//     }
// };

interface UpdateCategoryData {
    name?: string;
    description?: string;
}


export const updateCategory = createAsyncThunk(
    'categories/update',
    async ({ categoryId, categoryData }: { categoryId: number; categoryData: UpdateCategoryData }, { rejectWithValue }) => {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(categoryData)
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else if (response.status < 500) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      } else {
        return rejectWithValue({ message: 'Server error' });
      }
    }
  );
// export const updateUserCategory = (categoryId, categoryData) => async (dispatch) => {
//     const response = await fetch(`/api/categories/${categoryId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(categoryData)
//     });
    
//     if (response.ok) {
//         const data = await response.json();
//         dispatch(updateCategory(data));
//         return data;
//     }
//     return null;
// };

export const deleteCategory = createAsyncThunk(
    '/categories/delete',
    async (categoryId: number, { rejectWithValue }) => {
        const response = await fetch(`/api/categories/${categoryId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            return categoryId;
        } else if (response.status < 500) {
            const errorData = await response.json();
            return rejectWithValue(errorData);
        } else {
            return rejectWithValue({ message: 'Server Error' });
        }
    }
);

// export const deleteCategory = (categoryId) => async (dispatch) => {
//     const response = await fetch(`/api/categories/${categoryId}`, {
//         method: 'DELETE',
//         credentials: 'include'
//     });

//     if (response.ok) {
//         dispatch(removeCategory(categoryId));
//         return true;
//     }
//     return false
// };

const initialState: CategoriesState = [];

// const categoriesReducer = (state = initialState, action) => {
//     switch(action.type) {
//         case LOAD_CATEGORIES:
//             return [...action.categories];
//         case ADD_CATEGORY:
//             return [...state, action.category];
//         case UPDATE_CATEGORY:
//             return state.map(category => 
//                 category.id === action.category.id ? action.category : category
//             );
//         case REMOVE_CATEGORY:
//             return state.filter(category => category.id !== action.categoryId);
//         default:
//             return state;
//     }
// };

// export default categoriesReducer;

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchCategories.fulfilled, (state, action) => {
            return action.payload;
        })

        .addCase(fetchCategory.fulfilled, (state, action) => {
            if (!action.payload) return state;

            const index = state.findIndex(category => category.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            } else {
                state.push(action.payload);
            }
        })

        .addCase(createCategory.fulfilled, (state, action) => {
            state.push(action.payload);
        })

        .addCase(updateCategory.fulfilled, (state, action) => {
            const index = state.findIndex(category => category.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        })

        .addCase(deleteCategory.fulfilled, (state, action) => {
            return state.filter(category => category.id !== action.payload);
        });
    }
})

export default categoriesSlice.reducer;