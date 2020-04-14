import { FoodItemTypes } from './food-item.types';

export const addFoodItem = (foodItem) => ({
  type: FoodItemTypes.ADD_FOOD_ITEM,
  payload: foodItem,
});
