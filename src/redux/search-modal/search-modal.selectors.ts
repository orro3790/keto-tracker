import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';

const selectSearchModal = (state: RootState) => state.searchModal;

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
  (searchModal) => searchModal.allowUpdateFirebase
);

export const selectMeal = createSelector(
  [selectSearchModal],
  (searchModal) => searchModal.modal.meal
);
