// User-related types
export interface User {
    id: number;
    email: string;
    username: string;
  }
  
  export interface SessionState {
    user: User | null;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface SignupData extends LoginCredentials {
    username: string;
  }
  
  export interface ErrorResponse {
    server?: string;
    [key: string]: string | undefined;
  }
  
  // Category-related types
  export interface Category {
    id: number;
    user_id: number | null;
    name: string;
    description: string;
    is_default: boolean;
    created_at: string;
  }
  
  export type CategoriesState = Category[];
  
  // Location-related types
  export interface Location {
    id: number;
    user_id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    created_at: string;
    updated_at: string;
  }
  
  export type LocationsState = Location[];
  
  // Help Request-related types
  export interface HelpRequest {
    id: number;
    userId: number;
    locationId: number | null;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    categories?: Category[];
  }
  
  export type HelpRequestsState = HelpRequest[];
  
  export interface CreateHelpRequestData {
    title: string;
    description: string;
    locationId?: number | null;
    status?: string;
    categoryIds?: number[];
  }
  
  export interface UpdateHelpRequestData {
    title?: string;
    description?: string;
    status?: string;
  }
  
  // Redux Store type
  export interface RootState {
    session: SessionState;
    helpRequests: HelpRequestsState;
    locations: LocationsState;
    categories: CategoriesState;
  }