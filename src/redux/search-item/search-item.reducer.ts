import {
  Actions,
  CREATE_FOOD_REFERENCE,
  TOGGLE_SUGGESTION_WINDOW,
  State,
} from './search-item.types';

const INITIAL_STATE: State = {
  foodReference: '',
  suggestionWindow: false,
};

const searchItemReducer = (state = INITIAL_STATE, action: Actions) => {
  switch (action.type) {
    case CREATE_FOOD_REFERENCE:
      return {
        ...state,
        foodReference: action.payload,
      };
    case TOGGLE_SUGGESTION_WINDOW:
      return {
        ...state,
        suggestionWindow: action.payload,
      };
    default:
      return state;
  }
};

export default searchItemReducer;
