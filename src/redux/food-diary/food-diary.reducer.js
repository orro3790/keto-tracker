import { FoodDiaryActionTypes } from './food-diary.types';

const INITIAL_STATE = {
  foodDatabase: [],
};

const foodDiaryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FoodDiaryActionTypes.UPDATE_FOOD_DATABASE:
      return {
        ...state,
        foodDatabase: action.payload,
      };
    default:
      return state;
  }
};

export default foodDiaryReducer;
