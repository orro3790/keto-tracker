import { SearchItemSuggestionActionTypes } from './../search-item-suggestion/search-item-suggestion.types';

export const ToggleAddFoodToDiaryModal = (food) => ({
  type: SearchItemSuggestionActionTypes.TOGGLE_ADD_FOOD_TO_DIARY_MODAL,
  payload: food,
});

export const ToggleSuggestionWindow = (status) => ({
  type: SearchItemSuggestionActionTypes.TOGGLE_SUGGESTION_WINDOW,
  payload: status,
});
