import { DailyHudActionTypes } from './daily-hud.types';

export const setHudModel = (model) => ({
  type: DailyHudActionTypes.SELECT_HUD_MODEL,
  payload: model,
});
