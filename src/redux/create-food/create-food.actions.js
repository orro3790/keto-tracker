import { CreateFoodActionTypes } from './create-food.types';

export const toggleCreateFoodModal = (status) => ({
  type: CreateFoodActionTypes.TOGGLE_CREATE_FOOD_MODAL,
  payload: status,
});
