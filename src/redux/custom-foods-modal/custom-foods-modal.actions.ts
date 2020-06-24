import * as Types from './custom-foods-modal.types';

export const toggleCustomFoodsModal = (
  status: Types.ToggleCustomFoodsModal
) => ({
  type: Types.TOGGLE_CUSTOM_FOODS_MODAL,
  payload: status,
});
