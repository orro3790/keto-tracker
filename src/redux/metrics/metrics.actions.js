import { MetricsActionTypes } from './metrics.types';

export const setMetricsData = (status) => ({
  type: MetricsActionTypes.SET_METRICS_DATA,
  payload: status,
});
