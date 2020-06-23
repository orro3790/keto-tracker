import * as DateSelectorTypes from './date-selector.types';

export const setCurrentDate = (date: object): DateSelectorTypes.Actions => ({
  type: DateSelectorTypes.SET_CURRENT_DATE,
  payload: date,
});

export const setEntry = (
  entry: DateSelectorTypes.Entry
): DateSelectorTypes.Actions => ({
  type: DateSelectorTypes.SET_DIARY_ENTRY,
  payload: entry,
});
