import { ViewFavsActionTypes } from './favs-modal.types';

export const toggleViewFavsModal = (status) => ({
  type: ViewFavsActionTypes.TOGGLE_FAVS_MODAL,
  payload: status,
});
