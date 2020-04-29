import { SearchItemSuggestionActionTypes } from './search-item-suggestion.types';

const INITIAL_STATE = {
  foodItemToAdd: {
    name: 'default name',
    description: 'default description',
    grams: 0,
    fats: 0,
    carbs: 0,
    protein: 0,
    calories: 0,
  },
  suggestionWindow: false,
};

const searchItemSuggestionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SearchItemSuggestionActionTypes.ADD_FOOD_TO_DIARY:
      return {
        ...state,
        foodItemToAdd: action.payload,
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
