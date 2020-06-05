import { SearchModalActionTypes } from './search-food-modal.types';

export const toggleSearchModal = (status) => ({
  type: SearchModalActionTypes.TOGGLE_SEARCH_MODAL,
  payload: status,
});

export const allowUpdateFirebase = (status) => ({
  type: SearchModalActionTypes.ALLOW_ENTRY_UPDATE_FIREBASE,
  payload: status,
});

export const setFoodFilter = (filter) => ({
  type: SearchModalActionTypes.SET_FOOD_FILTER,
  payload: filter,
});
