import { ConfirmationModalActionTypes } from './confirmation-modal.types';

const INITIAL_STATE = {
  modalStatus: 'closed',
};

const confirmationModalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ConfirmationModalActionTypes.TOGGLE_CONFIRMATION:
      return {
        ...state,
        modalStatus: action.payload,
      };
    default:
      return state;
  }
};

export default confirmationModalReducer;
