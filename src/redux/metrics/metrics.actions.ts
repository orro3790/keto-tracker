import * as Types from './metrics.types';

export const setMetricsData = (
  status: Types.Data | ''
): Types.SetMetricsData => ({
  type: Types.SET_METRICS_DATA,
  payload: status,
});
