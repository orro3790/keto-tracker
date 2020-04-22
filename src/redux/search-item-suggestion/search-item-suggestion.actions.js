import { SearchItemSuggestionActionTypes } from './../search-item-suggestion/search-item-suggestion.types';

export const AddFoodItemToDiary = (foodItem) => ({
  type: SearchItemSuggestionActionTypes.ADD_FOOD_TO_DIARY,
  payload: foodItem,
});

export const ToggleSuggestionWindow = (status) => ({
  type: SearchItemSuggestionActionTypes.TOGGLE_SUGGESTION_WINDOW,
  payload: status,
});
