// Define the shape of the searchItem State
export interface State {
  foodReference: '' | Food;
  suggestionWindow: boolean;
}

// Define the shape of Food object
export interface Food {
  b: string;
  c: number;
  d: number;
  e: number;
  f: number;
  g: number;
  i: number;
  id: string;
  k: number;
  n: string;
  p: number;
  size?: number;
  u: 'g' | 'ml';
}

// Define action name types
export const CREATE_FOOD_REFERENCE = 'CREATE_FOOD_REFERENCE';
export const TOGGLE_SUGGESTION_WINDOW = 'TOGGLE_SUGGESTION_WINDOW';

// Define action types
export interface CreateFoodReference {
  type: typeof CREATE_FOOD_REFERENCE;
  payload: Food | '';
}

export interface ToggleSuggestionWindow {
  type: typeof TOGGLE_SUGGESTION_WINDOW;
  payload: boolean;
}

// Define all possible action types
export type Actions = CreateFoodReference | ToggleSuggestionWindow;
