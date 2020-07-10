export interface State {
  entry: Entry | '';
}

export interface Meal {
  [index: string]: any;
  f: object[];
  t: {
    [index: string]: any;
    f: number;
    c: number;
    p: number;
    e: number;
    d: number;
    k: number;
  };
}

export interface Entry {
  [index: string]: any;
  b: Meal;
  l: Meal;
  d: Meal;
  s: Meal;
  w: {
    t: null | number;
  };
  t: any;
  m: {
    [index: string]: any;
    f: number;
    c: number | null;
    p: number;
    e: number;
    d: number;
    k: number | null;
  };
  g: {
    s: {
      [index: string]: any;
      f: number;
      c: number | null;
      p: number;
      e: number;
      d: number | null;
      k: number | null;
      w: number | null;
    };
    p: {
      [index: string]: any;
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
