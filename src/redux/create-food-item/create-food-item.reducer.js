import { CreateFoodItemTypes } from './create-food-item.types';

const INITIAL_STATE = {
  createdFoods: [],
};

const createFoodItemReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CreateFoodItemTypes.CREATE_FOOD_ITEM:
      return {
        ...state,
        createdFoods: [...state.createdFoods, action.payload],
      };
    default:
      return state;
  }
};

export default createFoodItemReducer;
