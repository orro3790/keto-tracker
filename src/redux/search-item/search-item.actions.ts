import {
  CREATE_FOOD_REFERENCE,
  TOGGLE_SUGGESTION_WINDOW,
  Food,
  CreateFoodReference,
  ToggleSuggestionWindow,
} from './../search-item/search-item.types';

export const createFoodReference = (food: Food | ''): CreateFoodReference => ({
  type: CREATE_FOOD_REFERENCE,
  payload: food,
});

export const toggleSuggestionWindow = (
  status: boolean
): ToggleSuggestionWindow => ({
  type: TOGGLE_SUGGESTION_WINDOW,
  payload: status,
});
