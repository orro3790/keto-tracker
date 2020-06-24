import * as Types from './water-modal.types';

const INITIAL_STATE: Types.State = {
  modal: {
    status: 'hidden',
  },
};

const waterModalReducer = (
  state = INITIAL_STATE,
  action: Types.Actions
): Types.State => {
  switch (action.type) {
    case Types.TOGGLE_WATER_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    default:
      return state;
  }
};

export default waterModalReducer;
