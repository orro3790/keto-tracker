import { createSelector } from 'reselect';

const selectCreateFood = (state) => state.createFood;

export const selectCreateFoodModalStatus = createSelector(
  [selectCreateFood],
  (createFoodModal) => createFoodModal.modal.status
);
