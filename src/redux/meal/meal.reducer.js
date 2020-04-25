import { MealActionTypes } from './meal.types';

const INITIAL_STATE = {
  meal: [],
};

const mealReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MealActionTypes.ADD_FOOD_TO_MEAL:
      return {
        ...state,
        meal: action.payload,
      };
    default:
      return state;
  }
};

export default mealReducer;
