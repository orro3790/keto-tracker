import { FoodDiaryActionTypes } from './food-diary.types';

const INITIAL_STATE = {
  foodDatabase: [],
  entries: {
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
        foodDatabase: action.payload,
      };
    case FoodDiaryActionTypes.CREATE_DAILY_MEALS_OBJ:
      return {
        ...state,
        entries: action.payload,
      };
    default:
      return state;
  }
};

export default foodDiaryReducer;
