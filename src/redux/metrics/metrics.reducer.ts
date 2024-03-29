import * as Types from './metrics.types';

const INITIAL_STATE: Types.State = {
  data: '',
};

const metricsReducer = (
  state = INITIAL_STATE,
  action: Types.Actions
): Types.State => {
  switch (action.type) {
    case Types.SET_METRICS_DATA:
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};

export default metricsReducer;
