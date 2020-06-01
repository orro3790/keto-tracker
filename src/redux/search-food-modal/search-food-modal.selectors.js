import { createSelector } from 'reselect';

const selectSearchModal = (state) => state.searchModal;

export const selectModal = createSelector(
  [selectSearchModal],
  (searchModal) => searchModal.modal
);

export const selectFoodFilter = createSelector(
  [selectSearchModal],
  (searchModal) => searchModal.foodFilter
);

export const selectUpdate = createSelector(
  [selectSearchModal],
  (searchModal) => searchModal.updateFirebase
);

export const selectMeal = createSelector(
  [selectSearchModal],
  (searchModal) => searchModal.modal.meal
);
