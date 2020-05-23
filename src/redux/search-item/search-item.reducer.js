import { SearchItemActionTypes } from './search-item.types';

const INITIAL_STATE = {
  foodReference: '',
  suggestionWindow: false,
};

const searchItemReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SearchItemActionTypes.CREATE_FOOD_REFERENCE:
      return {
        ...state,
        foodReference: action.payload,
      };
    case SearchItemActionTypes.TOGGLE_SUGGESTION_WINDOW:
      return {
        ...state,
        suggestionWindow: action.payload,
      };
    default:
      return state;
  }
};

export default searchItemReducer;
