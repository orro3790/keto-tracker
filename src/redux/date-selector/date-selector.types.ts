export interface State {
  entry: Entry | '';
}

export interface Meal {
  f: object[];
  t: {
    f: number;
    c: number;
    p: number;
    e: number;
    d: number;
    k: number;
  };
}

export interface Entry {
  b: Meal;
  l: Meal;
  d: Meal;
  s: Meal;
  w: {
    t: null | number;
  };
  t: any;
  m: {
    f: number;
    c: number;
    p: number;
    e: number;
    d: number;
    k: number;
  };
  g: {
    s: {
      f: number;
      c: number | null;
      p: number;
      e: number;
      d: number | null;
      k: number | null;
      w: number | null;
    };
    p: {
      f: number;
      c: number | null;
      p: number;
      e: number;
      d: number | null;
      k: number | null;
      w: number | null;
    };
  };
}

// Define action type names
export const SET_CURRENT_DATE = 'SET_CURRENT_DATE';
export const SET_DIARY_ENTRY = 'SET_DIARY_ENTRY';

// Define action types
export interface SetCurrentDate {
  type: typeof SET_CURRENT_DATE;
  payload: object;
}

export interface SetEntry {
  type: typeof SET_DIARY_ENTRY;
  payload: Entry;
}

// Define all possible action types
export type Actions = SetCurrentDate | SetEntry;
