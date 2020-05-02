import { SearchItemSuggestionActionTypes } from './search-item-suggestion.types';

const INITIAL_STATE = {
  foodReference: '',
  suggestionWindow: false,
};

const searchItemSuggestionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SearchItemSuggestionActionTypes.CREATE_FOOD_REFERENCE:
      return {
        ...state,
        foodReference: action.payload,
      };
    case SearchItemSuggestionActionTypes.TOGGLE_SUGGESTION_WINDOW:
      return {
        ...state,
        suggestionWindow: action.payload,
      };
    default:
      return state;
  }
};

export default searchItemSuggestionReducer;
