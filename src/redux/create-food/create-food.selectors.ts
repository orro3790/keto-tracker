import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';

const selectCreateFood = (state: RootState) => state.createFood;

export const selectCreateFoodModalStatus = createSelector(
  [selectCreateFood],
  (createFoodModal) => createFoodModal.modal.status
);
