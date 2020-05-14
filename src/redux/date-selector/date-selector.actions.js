import { DateSelectorActionTypes } from './date-selector.types';

export const setCurrentDate = (date) => ({
  type: DateSelectorActionTypes.SET_CURRENT_DATE,
  payload: date,
});

export const setEntry = (entries) => ({
  type: DateSelectorActionTypes.SET_DIARY_ENTRY,
  payload: entries,
});
