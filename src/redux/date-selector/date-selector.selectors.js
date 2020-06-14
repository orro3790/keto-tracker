import { createSelector } from 'reselect';

const selectDateSelector = (state) => state.dateSelector;

export const selectEntry = createSelector(
  [selectDateSelector],
  (dateSelector) => dateSelector.entry
);

export const selectWater = createSelector(
  [selectDateSelector],
  (dateSelector) => dateSelector.entry.water
);
