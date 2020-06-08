import { createSelector } from 'reselect';

const selectMetrics = (state) => state.metrics;

export const selectMetricsData = createSelector(
  [selectMetrics],
  (metrics) => metrics.data
);
