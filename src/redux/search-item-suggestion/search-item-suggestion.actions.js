import { SearchItemSuggestionActionTypes } from './../search-item-suggestion/search-item-suggestion.types';

export const createFoodReference = (food) => ({
  type: SearchItemSuggestionActionTypes.CREATE_FOOD_REFERENCE,
  payload: food,
});

export const ToggleSuggestionWindow = (status) => ({
  type: SearchItemSuggestionActionTypes.TOGGLE_SUGGESTION_WINDOW,
  payload: status,
});
