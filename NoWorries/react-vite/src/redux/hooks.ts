import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export const useUser = () => useAppSelector(state => state.session.user);
export const useHelpRequests = () => useAppSelector(state => state.helpRequests);
export const useLocations = () => useAppSelector(state => state.locations);
export const useCategories = () => useAppSelector(state => state.categories);