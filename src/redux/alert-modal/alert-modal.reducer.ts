import { State, Actions, TOGGLE_ALERT_MODAL } from './alert-modal.types';

const INITIAL_STATE: State = {
  modal: {
    title: '',
    msg: '',
    img: '',
    status: 'hidden',
    sticky: false,
    enabled: false,
  },
};

const alertModalReducer = (state = INITIAL_STATE, action: Actions): State => {
  switch (action.type) {
    case TOGGLE_ALERT_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    default:
      return state;
  }
};

export default alertModalReducer;
