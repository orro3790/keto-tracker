import { WaterModalActionTypes } from './water-modal.types';

export const toggleWaterModal = (status) => ({
  type: WaterModalActionTypes.TOGGLE_WATER_MODAL,
  payload: status,
});
