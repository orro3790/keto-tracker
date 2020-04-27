import { SearchItemSuggestionActionTypes } from './../search-item-suggestion/search-item-suggestion.types';

export const ToggleAddFoodToDiaryModal = (food) => ({
  type: SearchItemSuggestionActionTypes.ADD_FOOD_TO_DIARY,
  payload: food,
});

export const ToggleSuggestionWindow = (status) => ({
  type: SearchItemSuggestionActionTypes.TOGGLE_SUGGESTION_WINDOW,
  payload: status,
});
