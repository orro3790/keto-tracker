import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';

const selectViewFavModal = (state: RootState) => state.favsModal;

export const selectFavModalStatus = createSelector(
  [selectViewFavModal],
  (viewFavs) => viewFavs.modal.status
);
