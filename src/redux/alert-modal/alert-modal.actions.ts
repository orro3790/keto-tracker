import {
  AlertModal,
  ToggleAlertModal,
  TOGGLE_ALERT_MODAL,
} from './alert-modal.types';

// TypeScript infers that this function is returning toggleAlertModal
export const toggleAlertModal = (object: AlertModal): ToggleAlertModal => {
  return {
    type: TOGGLE_ALERT_MODAL,
    payload: object,
  };
};
