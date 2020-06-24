import * as Types from './../search-item/search-item.types';

const INITIAL_STATE: Types.State = {
  foodReference: '',
  suggestionWindow: false,
};

const searchItemReducer = (state = INITIAL_STATE, action: Types.Actions) => {
  switch (action.type) {
    case Types.CREATE_FOOD_REFERENCE:
      return {
        ...state,
        foodReference: action.payload,
      };
    case Types.TOGGLE_SUGGESTION_WINDOW:
      return {
        ...state,
        suggestionWindow: action.payload,
      };
    default:
      return state;
  }
};

export default searchItemReducer;
