import * as Types from './favs-modal.types';

const INITIAL_STATE: Types.State = {
  modal: {
    status: 'hidden',
  },
};

const FavsModalReducer = (
  state = INITIAL_STATE,
  action: Types.Actions
): Types.State => {
  switch (action.type) {
    case Types.TOGGLE_FAVS_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    default:
      return state;
  }
};

export default FavsModalReducer;
