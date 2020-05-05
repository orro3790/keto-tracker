import { DailyHudActionTypes } from './daily-hud.types';

const INITIAL_STATE = {
  hudModel: 'remaining',
};

const dailyHudReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DailyHudActionTypes.SELECT_HUD_MODEL:
      return {
        ...state,
        hudModel: action.payload,
      };
    default:
      return state;
  }
};

export default dailyHudReducer;
