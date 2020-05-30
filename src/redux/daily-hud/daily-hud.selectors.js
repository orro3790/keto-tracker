import { createSelector } from 'reselect';

const selectDailyHud = (state) => state.dailyHud;

export const selectHudSettings = createSelector(
  [selectDailyHud],
  (dailyHud) => dailyHud.hudModel
);
