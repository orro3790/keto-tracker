import { AlertModalActionTypes } from './alert-modal.types';

export const toggleAlertModal = (status) => ({
  type: AlertModalActionTypes.TOGGLE_ALERT_MODAL,
  payload: status,
});
