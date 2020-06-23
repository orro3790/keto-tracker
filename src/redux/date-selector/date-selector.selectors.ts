import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';

const selectDateSelector = (state: RootState) => state.dateSelector;

export const selectEntry = createSelector(
  [selectDateSelector],
  (dateSelector) => dateSelector.entry
);
