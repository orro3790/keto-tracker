import { CustomFoodsModalActionTypes } from './custom-foods-modal.types';

const INITIAL_STATE = {
  modal: {
    status: 'hidden',
  },
};

const customFoodsModalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CustomFoodsModalActionTypes.TOGGLE_CUSTOM_FOODS_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    default:
      return state;
  }
};

export default customFoodsModalReducer;
