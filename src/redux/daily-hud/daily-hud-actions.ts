import * as DailyHudTypes from './daily-hud.types';

export const setHudModel = (
  model: DailyHudTypes.HudModel
): DailyHudTypes.Actions => ({
  type: DailyHudTypes.SELECT_HUD_MODEL,
  payload: model,
});
