import * as Types from './custom-foods-modal.types';

export const toggleCustomFoodsModal = (
  object: Types.Modal
): Types.ToggleCustomFoodsModal => ({
  type: Types.TOGGLE_CUSTOM_FOODS_MODAL,
  payload: object,
});
