import * as Types from './alert-modal.types';

const INITIAL_STATE: Types.State = {
  modal: {
    title: '',
    msg: '',
    icon: '',
    status: 'hidden',
    sticky: false,
    enabled: false,
  },
};

const alertModalReducer = (
  state = INITIAL_STATE,
  action: Types.Actions
): Types.State => {
  switch (action.type) {
    case Types.TOGGLE_ALERT_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    default:
      return state;
  }
};

export default alertModalReducer;
