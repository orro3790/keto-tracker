import * as Types from './search-modal.types';

export const toggleSearchModal = (
  object: Types.Modal
): Types.ToggleSearchModal => ({
  type: Types.TOGGLE_SEARCH_MODAL,
  payload: object,
});

export const allowUpdateFirebase = (
  status: boolean
): Types.AllowUpdateFirebase => ({
  type: Types.ALLOW_ENTRY_UPDATE_FIREBASE,
  payload: status,
});

export const setFoodFilter = (
  object: Types.FoodFilter
): Types.SetFoodFilter => ({
  type: Types.SET_FOOD_FILTER,
  payload: object,
});
