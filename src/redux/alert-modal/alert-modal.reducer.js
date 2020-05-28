import { AlertModalActionTypes } from './alert-modal.types';

const INITIAL_STATE = {
  modal: {
    title: '',
    msg: '',
    img: '',
    status: 'hidden',
  },
};

const alertModalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AlertModalActionTypes.TOGGLE_ALERT_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    default:
      return state;
  }
};

export default alertModalReducer;
