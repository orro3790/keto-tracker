import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';

const selectMetrics = (state: RootState) => state.metrics;

export const selectMetricsData = createSelector(
  [selectMetrics],
  (metrics) => metrics.data
);
