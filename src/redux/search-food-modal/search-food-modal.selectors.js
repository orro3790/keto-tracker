import { createSelector } from 'reselect';

const selectSearchModal = (state) => state.searchModal;

export const selectModal = createSelector(
  [selectSearchModal],
  (searchModal) => searchModal.modal
);

export const selectUpdate = createSelector(
  [selectSearchModal],
  (searchModal) => searchModal.updateTotals
);
