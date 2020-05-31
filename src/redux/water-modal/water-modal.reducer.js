import { WaterModalActionTypes } from './water-modal.types';

const INITIAL_STATE = {
  modal: {
    status: 'hidden',
  },
};

const waterModalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WaterModalActionTypes.TOGGLE_WATER_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    default:
      return state;
  }
};

export default waterModalReducer;
