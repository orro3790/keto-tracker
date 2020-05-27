import { ViewFavsActionTypes } from './favs-modal.types';

export const toggleFavsModal = (status) => ({
  type: ViewFavsActionTypes.TOGGLE_FAVS_MODAL,
  payload: status,
});
