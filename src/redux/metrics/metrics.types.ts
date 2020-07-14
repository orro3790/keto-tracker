// Define the shape of macros object
export interface Macros {
  f: number;
  c: number;
  p: number;
  e: number;
  d: number;
  k: number;
}

// Define the shape of the goals object (snapshot and precision)
export interface Goal {
  f: number;
  c: number | null;
  p: number;
  e: number;
  d: number | null;
  k: number | null;
  w: number | null;
}

// Define the Goal object's keys, used primarily for indexing in forEach blocks
export type GoalKeys = 'f' | 'c' | 'p' | 'e' | 'd' | 'k' | 'w';

// Define the shape of an individual date within the monthly data object
export interface Datum {
  b: Macros;
  l: Macros;
  d: Macros;
  s: Macros;
  m: Macros;
  g: {
    p: Goal;
    s: Goal;
  };
  w: {
    t: number;
  };
}

// Define the shape monthly data object in metrics collection
export interface MonthlyData {
  [index: string]: Datum;
}

// Define the shape of state
export interface State {
  data: Data | '';
}

// Define the shape of the master data object
export interface Data {
  [index: string]: MonthlyData;
}

// Define action name types
export const SET_METRICS_DATA = 'SET_METRICS_DATA';

// Define action types
export interface SetMetricsData {
  type: typeof SET_METRICS_DATA;
  payload: Data | '';
}

// Define all possible actions
export type Actions = SetMetricsData;
