import { CustomFoodsModalActionTypes } from './custom-foods-modal.types';

export const toggleCustomFoodsModal = (status) => ({
  type: CustomFoodsModalActionTypes.TOGGLE_CUSTOM_FOODS_MODAL,
  payload: status,
});
