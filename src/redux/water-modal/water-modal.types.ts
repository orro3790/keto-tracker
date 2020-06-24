// Define the shape of the modal object in state
export interface Modal {
  status: 'hidden' | 'visible';
}

// Define the shape of state
export interface State {
  modal: Modal;
}

// Define action name types
export const TOGGLE_WATER_MODAL = 'TOGGLE_WATER_MODAL';

// Define action types
export interface ToggleWaterModal {
  type: typeof TOGGLE_WATER_MODAL;
  payload: Modal;
}

// Define all possible actions
export type Actions = ToggleWaterModal;
