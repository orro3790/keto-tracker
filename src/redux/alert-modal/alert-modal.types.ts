// Define the shape of the alert modal reducer
export interface State {
  modal: Modal;
}

// Define the shape of the alert modal object
export interface Modal {
  title: string;
  msg: string;
  icon?: string;
  status: 'visible' | 'hidden';
  sticky: boolean;
  callback?: string;
  enabled?: boolean;
}

// Define action type names
export const TOGGLE_ALERT_MODAL = 'TOGGLE_ALERT_MODAL';

// Define action types
export interface ToggleAlertModal {
  type: typeof TOGGLE_ALERT_MODAL;
  payload: Modal;
}

// Define all possible actions
export type Actions = ToggleAlertModal;
