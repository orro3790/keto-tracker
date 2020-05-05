import { DailyHudActionTypes } from './daily-hud.types';

export const selectHudModel = (model) => ({
  type: DailyHudActionTypes.SELECT_HUD_MODEL,
  payload: model,
});
