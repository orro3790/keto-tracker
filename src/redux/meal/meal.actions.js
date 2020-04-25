import { MealActionTypes } from './meal.types';

export const toggleSearchModal = (status) => ({
  type: MealActionTypes.TOGGLE_SEARCH_MODAL,
  payload: status,
});
