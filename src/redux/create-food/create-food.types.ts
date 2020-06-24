// Define the shape of the modal object in state
export interface Modal {
  status: 'hidden' | 'visible';
}

// Define the shape of state
export interface State {
  modal: Modal;
}

// Define action name types
export const TOGGLE_CREATE_FOOD_MODAL = 'TOGGLE_CREATE_FOOD_MODAL';

// Define action type names
export interface ToggleCreateFoodModal {
  type: typeof TOGGLE_CREATE_FOOD_MODAL;
  payload: Modal;
}

// Define all possible actions
export type Actions = ToggleCreateFoodModal;
