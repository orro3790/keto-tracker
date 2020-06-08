import { MetricsActionTypes } from './metrics.types';

const INITIAL_STATE = {
  data: '',
};

const metricsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MetricsActionTypes.SET_METRICS_DATA:
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};

export default metricsReducer;
