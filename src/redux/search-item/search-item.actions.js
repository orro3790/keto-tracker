import { SearchItemActionTypes } from './../search-item/search-item.types';

export const createFoodReference = (food) => ({
  type: SearchItemActionTypes.CREATE_FOOD_REFERENCE,
  payload: food,
});

export const ToggleSuggestionWindow = (status) => ({
  type: SearchItemActionTypes.TOGGLE_SUGGESTION_WINDOW,
  payload: status,
});
