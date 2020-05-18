import { CreateFoodActionTypes } from './create-food.types';

export const createFoodItem = (newFoodItem) => ({
  type: CreateFoodActionTypes.CREATE_FOOD,
  payload: newFoodItem,
});

export const toggleCreateFoodModal = (status) => ({
  type: CreateFoodActionTypes.TOGGLE_CREATE_FOOD_MODAL,
  payload: status,
});
