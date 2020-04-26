import { FoodDiaryActionTypes } from './food-diary.types';

const INITIAL_STATE = {
  foods: [],
  meals: {
    initialDay: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    },
  },
};

const foodDiaryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FoodDiaryActionTypes.UPDATE_FOOD_DATABASE:
      return {
        ...state,
        foods: action.payload,
      };
    case FoodDiaryActionTypes.CREATE_DAILY_MEALS_OBJ:
      return {
        ...state,
        meals: action.payload,
      };
    default:
      return state;
  }
};

export default foodDiaryReducer;
