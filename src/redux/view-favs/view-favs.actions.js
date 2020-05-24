import { ViewFavsActionTypes } from './view-favs.types';

export const toggleViewFavsModal = (status) => ({
  type: ViewFavsActionTypes.TOGGLE_FAVS_MODAL,
  payload: status,
});
