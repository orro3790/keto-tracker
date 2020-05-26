import { ViewFavsActionTypes } from './favs-modal.types';

const INITIAL_STATE = {
  modal: {
    status: 'hidden',
  },
};

const FavsModalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ViewFavsActionTypes.TOGGLE_FAVS_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    default:
      return state;
  }
};

export default FavsModalReducer;
