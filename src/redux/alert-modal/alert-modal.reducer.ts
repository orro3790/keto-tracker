import * as AlertModalTypes from './alert-modal.types';

const INITIAL_STATE: AlertModalTypes.State = {
  modal: {
    title: '',
    msg: '',
    img: '',
    status: 'hidden',
    sticky: false,
    enabled: false,
  },
};

const alertModalReducer = (
  state = INITIAL_STATE,
  action: AlertModalTypes.Actions
): AlertModalTypes.State => {
  switch (action.type) {
    case AlertModalTypes.TOGGLE_ALERT_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    default:
      return state;
  }
};

export default alertModalReducer;
