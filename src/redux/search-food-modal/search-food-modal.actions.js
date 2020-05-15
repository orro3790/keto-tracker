import { SearchModalActionTypes } from './search-food-modal.types';

export const toggleSearchModal = (status) => ({
  type: SearchModalActionTypes.TOGGLE_SEARCH_MODAL,
  payload: status,
});

export const updateTotals = (status) => ({
  type: SearchModalActionTypes.UPDATE_TOTALS,
  payload: status,
});
