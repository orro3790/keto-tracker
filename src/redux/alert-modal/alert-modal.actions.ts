import * as AlertModalTypes from './alert-modal.types';

// TypeScript infers that this function is returning toggleAlertModal
export const toggleAlertModal = (
  object: AlertModalTypes.AlertModal
): AlertModalTypes.ToggleAlertModal => {
  return {
    type: AlertModalTypes.TOGGLE_ALERT_MODAL,
    payload: object,
  };
};
