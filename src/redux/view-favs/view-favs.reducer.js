import { ViewFavsActionTypes } from './view-favs.types';

const INITIAL_STATE = {
  modal: {
    status: 'hidden',
  },
};

const viewFavsReducer = (state = INITIAL_STATE, action) => {
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

export default viewFavsReducer;
