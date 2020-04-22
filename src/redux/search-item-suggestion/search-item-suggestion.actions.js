import { SearchItemSuggestionActionTypes } from './../search-item-suggestion/search-item-suggestion.types';

export const AddFoodItemToDiary = (foodItem) => ({
  type: SearchItemSuggestionActionTypes.ADD_FOOD_TO_DIARY,
  payload: foodItem,
});

export const CloseSuggestionWindow = (status) => ({
  type: SearchItemSuggestionActionTypes.CLOSE_SUGGESTION_WINDOW,
  payload: status,
});
