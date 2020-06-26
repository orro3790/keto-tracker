import * as Types from './date-selector.types';

export const setCurrentDate = (date: object): Types.SetCurrentDate => ({
  type: Types.SET_CURRENT_DATE,
  payload: date,
});

export const setEntry = (entry: Types.Entry): Types.SetEntry => ({
  type: Types.SET_DIARY_ENTRY,
  payload: entry,
});
