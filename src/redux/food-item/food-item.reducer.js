import { FoodItemTypes } from './food-item.types';

const INITIAL_STATE = {
  foodItems: [],
};

const foodItemReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FoodItemTypes.ADD_FOOD_ITEM:
      return {
        ...state,
        foodItems: [...state.foodItems, action.payload],
      };
    default:
      return state;
  }
};

export default foodItemReducer;
