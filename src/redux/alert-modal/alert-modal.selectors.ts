import { createSelector } from 'reselect';
import { RootState } from './../root-reducer';

const selectAlertModal = (state: RootState) => state.alertModal.modal;

export const alertModal = createSelector([selectAlertModal], (alertModal) => {
  return alertModal;
});
