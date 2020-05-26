import { createSelector } from 'reselect';

const selectViewFavModal = (state) => state.viewFavs;

export const selectViewFavModalStatus = createSelector(
  [selectViewFavModal],
  (viewFavs) => viewFavs.modal.status
);
