import * as Types from './water-modal.types';

export const toggleWaterModal = (
  status: Types.Modal
): Types.ToggleWaterModal => ({
  type: Types.TOGGLE_WATER_MODAL,
  payload: status,
});
