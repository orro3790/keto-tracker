import * as Types from './custom-foods-modal.types';

const INITIAL_STATE: Types.State = {
  modal: {
    status: 'hidden',
  },
};

const customFoodsModalReducer = (
  state = INITIAL_STATE,
  action: Types.Actions
): Types.State => {
  switch (action.type) {
    case Types.TOGGLE_CUSTOM_FOODS_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    default:
      return state;
  }
};

export default customFoodsModalReducer;
