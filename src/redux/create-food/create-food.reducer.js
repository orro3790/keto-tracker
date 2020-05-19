import { CreateFoodActionTypes } from './create-food.types';

const INITIAL_STATE = {
  createFoodModal: {
    status: 'hidden',
  },
};

const createFoodReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CreateFoodActionTypes.TOGGLE_CREATE_FOOD_MODAL:
      return {
        ...state,
        createFoodModal: action.payload,
      };
    default:
      return state;
  }
};

export default createFoodReducer;
