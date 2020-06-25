import * as Types from './alert-modal.types';

// TypeScript infers that this function is returning toggleAlertModal
export const toggleAlertModal = (
  object: Types.Modal
): Types.ToggleAlertModal => {
  return {
    type: Types.TOGGLE_ALERT_MODAL,
    payload: object,
  };
};
