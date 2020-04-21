import { CreateFoodItemActionTypes } from './create-food-item.types';

export const createFoodItem = (newFoodItem) => ({
  type: CreateFoodItemActionTypes.CREATE_FOOD_ITEM,
  payload: newFoodItem,
});

export const changeModalStatus = (status) => ({
  type: CreateFoodItemActionTypes.CHANGE_MODAL_STATUS,
  payload: status,
});

export const toggleConfirmation = (status) => ({
  type: CreateFoodItemActionTypes.TOGGLE_CONFIRMATION,
  payload: status,
});
