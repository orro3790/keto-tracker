// Define the shape of the UserState
export interface State {
  hudModel: HudModel;
}

export type HudModel = 'r' | 'a';

// Define action type names
export const SELECT_HUD_MODEL = 'SELECT_HUD_MODEL';

// Define action types
export interface SetHudModel {
  type: typeof SELECT_HUD_MODEL;
  payload: HudModel;
}

// Define all possible actions
export type Actions = SetHudModel;
