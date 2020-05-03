import { DateSelectorActionTypes } from './date-selector.types';

export const setCurrentDate = (date) => ({
  type: DateSelectorActionTypes.SET_CURRENT_DATE,
  payload: date,
});

export const createEntry = (entries) => ({
  type: DateSelectorActionTypes.CREATE_ENTRIES_OBJ,
  payload: entries,
});
