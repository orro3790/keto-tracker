import { createSelector } from 'reselect';

const selectViewFavModal = (state) => state.viewFavs;

export const selectFavModalStatus = createSelector(
  [selectViewFavModal],
  (viewFavs) => viewFavs.modal.status
);
