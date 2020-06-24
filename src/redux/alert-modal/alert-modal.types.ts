// Define the shape of the alert modal reducer
export interface State {
  modal: AlertModal;
}

// Define the shape of the alert modal object
export interface AlertModal {
  title: string;
  msg: string;
  img: string;
  status: string;
  sticky: boolean;
  callback?: string;
  enabled?: boolean;
}

// Define action type names
export const TOGGLE_ALERT_MODAL = 'TOGGLE_ALERT_MODAL';

// Define action types
export interface ToggleAlertModal {
  type: typeof TOGGLE_ALERT_MODAL;
  payload: AlertModal;
}

// Define all possible actions
export type Actions = ToggleAlertModal;