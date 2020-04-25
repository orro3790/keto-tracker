import { MealActionTypes } from './meal.types';

const INITIAL_STATE = {
  searchModal: {
    status: 'hidden',
    meal: 'none',
  },
};

const mealReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MealActionTypes.TOGGLE_SEARCH_MODAL:
      return {
        ...state,
        searchModal: action.payload,
      };
    default:
      return state;
  }
};

export default mealReducer;
