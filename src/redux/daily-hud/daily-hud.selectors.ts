import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';

const selectDailyHud = (state: RootState) => state.dailyHud;

export const selectHudSettings = createSelector(
  [selectDailyHud],
  (dailyHud) => dailyHud.hudModel
);
