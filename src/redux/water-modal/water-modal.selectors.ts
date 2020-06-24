import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';

const selectWaterModal = (state: RootState) => state.waterModal;

export const selectWaterModalStatus = createSelector(
  [selectWaterModal],
  (waterModal) => waterModal.modal.status
);
