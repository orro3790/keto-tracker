import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';

const selectCustomFoodsModal = (state: RootState) => state.customFoodsModal;

export const selectCustomFoodsModalStatus = createSelector(
  [selectCustomFoodsModal],
  (customFoodsModal) => customFoodsModal.modal.status
);
