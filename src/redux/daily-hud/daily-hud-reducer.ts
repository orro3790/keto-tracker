import * as DailyHudTypes from './daily-hud.types';

const INITIAL_STATE: DailyHudTypes.State = {
  hudModel: 'r',
};

const dailyHudReducer = (
  state = INITIAL_STATE,
  action: DailyHudTypes.Actions
) => {
  switch (action.type) {
    case DailyHudTypes.SELECT_HUD_MODEL:
      return {
        ...state,
        hudModel: action.payload,
      };
    default:
      return state;
  }
};

export default dailyHudReducer;
