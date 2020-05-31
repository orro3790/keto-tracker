import { createSelector } from 'reselect';

const selectDateSelector = (state) => state.dateSelector;

export const selectEntries = createSelector(
  [selectDateSelector],
  (dateSelector) => dateSelector.entries
);

export const selectWater = createSelector(
  [selectDateSelector],
  (dateSelector) => dateSelector.entries.water
);
