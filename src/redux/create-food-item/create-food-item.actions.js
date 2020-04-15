import { CreateFoodItemTypes } from './create-food-item.types';

export const createFoodItem = (newFoodItem) => ({
  type: CreateFoodItemTypes.CREATE_FOOD_ITEM,
  payload: newFoodItem,
});
