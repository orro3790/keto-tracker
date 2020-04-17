import { CreateFoodItemTypes } from './create-food-item.types';

const INITIAL_STATE = {
  createdFoods: [],
  modalStatus: 'closed',
  toggleConfirmation: 'false',
};

const createFoodItemReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CreateFoodItemTypes.CREATE_FOOD_ITEM:
      return {
        ...state,
        createdFoods: [...state.createdFoods, action.payload],
      };
    case CreateFoodItemTypes.CHANGE_MODAL_STATUS:
      return {
        ...state,
        modalStatus: action.payload,
      };
    case CreateFoodItemTypes.TOGGLE_CONFIRMATION:
      return {
        ...state,
        toggleConfirmation: action.payload,
      };
    default:
      return state;
  }
};

export default createFoodItemReducer;
