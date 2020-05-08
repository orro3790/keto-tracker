import { ConfirmationModalActionTypes } from './confirmation-modal.types';

export const toggleConfirmation = (status) => ({
  type: ConfirmationModalActionTypes.TOGGLE_CONFIRMATION,
  payload: status,
});
