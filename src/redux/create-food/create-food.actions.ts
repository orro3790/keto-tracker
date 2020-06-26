import * as Types from './create-food.types';

export const toggleCreateFoodModal = (
  status: Types.Modal
): Types.ToggleCreateFoodModal => ({
  type: Types.TOGGLE_CREATE_FOOD_MODAL,
  payload: status,
});
