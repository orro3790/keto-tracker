// Define the shape of the modal object in state
export interface Modal {
  status: 'hidden' | 'visible';
}

// Define the shape of state
export interface State {
  modal: Modal;
}

// Define action name types
export const TOGGLE_FAVS_MODAL = 'TOGGLE_FAVS_MODAL';

// Define action types
export interface ToggleFavsModal {
  type: typeof TOGGLE_FAVS_MODAL;
  payload: Modal;
}

// Define all possible actions
export type Actions = ToggleFavsModal;
