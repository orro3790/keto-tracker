// Define the shape of the modal object in state
export interface Modal {
  status: 'hidden' | 'visible';
}

// Define the shape of state
export interface State {
  modal: Modal;
}

// Define action name types
export const TOGGLE_CUSTOM_FOODS_MODAL = 'TOGGLE_CUSTOM_FOODS_MODAL';

// Define action type names
export interface ToggleCustomFoodsModal {
  type: typeof TOGGLE_CUSTOM_FOODS_MODAL;
  payload: Modal;
}

// Define all possible actions
export type Actions = ToggleCustomFoodsModal;
