import { SearchItemSuggestionActionTypes } from './search-item-suggestion.types';

const INITIAL_STATE = {
  foodReference: {
    name: 'default name',
    description: 'default description',
    size: 0,
    unit: 'g',
    fats: 0,
    fatsPer: 0,
    carbs: 0,
    carbsPer: 0,
    protein: 0,
    proteinPer: 0,
    calories: 0,
    caloriesPer: 0,
  },
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
