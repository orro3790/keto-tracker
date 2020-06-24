import { Food } from '../search-item/search-item.types';

// Define the shape of the modal object in state
export interface Modal {
  status: 'hidden' | 'visible';
  meal: '' | MealNames;
  editMode: {
    enabled: boolean;
    food: '' | Food;
    index: '' | number;
  };
}

export type MealNames = 'b' | 'l' | 'd' | 's';

// Define the shape of the foodFilter object in state
export interface FoodFilter {
  filter: 'usda' | 'fav' | 'custom-foods';
  path: string;
}

// Define shape of SearchModal state
export interface State {
  modal: Modal;
  foodFilter: FoodFilter;
  allowUpdateFirebase: boolean;
}

// Define action type names
export const TOGGLE_SEARCH_MODAL = 'TOGGLE_SEARCH_MODAL';
export const ALLOW_ENTRY_UPDATE_FIREBASE = 'ALLOW_ENTRY_UPDATE_FIREBASE';
export const SET_FOOD_FILTER = 'SET_FOOD_FILTER';

// Define action types
export interface ToggleSearchModal {
  type: typeof TOGGLE_SEARCH_MODAL;
  payload: Modal;
}

export interface AllowUpdateFirebase {
  type: typeof ALLOW_ENTRY_UPDATE_FIREBASE;
  payload: boolean;
}

export interface SetFoodFilter {
  type: typeof SET_FOOD_FILTER;
  payload: FoodFilter;
}

// Define all possible actions
export type Actions = ToggleSearchModal | AllowUpdateFirebase | SetFoodFilter;
