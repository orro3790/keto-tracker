import { createSelector } from 'reselect';

const selectWaterModal = (state) => state.waterModal;

export const selectWaterModalStatus = createSelector(
  [selectWaterModal],
  (waterModal) => waterModal.modal.status
);
