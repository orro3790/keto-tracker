import { createSelector } from 'reselect';

const selectCustomFoodsModal = (state) => state.customFoodsModal;

export const selectCustomFoodsModalStatus = createSelector(
  [selectCustomFoodsModal],
  (customFoodsModal) => customFoodsModal.modal.status
);
