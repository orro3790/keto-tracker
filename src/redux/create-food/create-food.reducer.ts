import * as Types from './create-food.types';

const INITIAL_STATE: Types.State = {
  modal: {
    status: 'hidden',
  },
};

const createFoodReducer = (
  state = INITIAL_STATE,
  action: Types.Actions
): Types.State => {
  switch (action.type) {
    case Types.TOGGLE_CREATE_FOOD_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    default:
      return state;
  }
};

export default createFoodReducer;
