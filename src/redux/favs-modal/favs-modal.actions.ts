import * as Types from './favs-modal.types';

export const toggleFavsModal = (
  object: Types.Modal
): Types.ToggleFavsModal => ({
  type: Types.TOGGLE_FAVS_MODAL,
  payload: object,
});
