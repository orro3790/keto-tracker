// Define the shape of state
export interface State {
  data: object[] | '';
}

// Define action name types
export const SET_METRICS_DATA = 'SET_METRICS_DATA';

// Define action types
export interface SetMetricsData {
  type: typeof SET_METRICS_DATA;
  payload: object[];
}

// Define all possible actions
export type Actions = SetMetricsData;
