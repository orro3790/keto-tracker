import { CreateFoodItemActionTypes } from './create-food-item.types';

const INITIAL_STATE = {
  createdFoods: [],
  modalStatus: 'hidden',
};

const createFoodItemReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CreateFoodItemActionTypes.CREATE_FOOD_ITEM:
      return {
        ...state,
        createdFoods: action.payload,
      };
    case CreateFoodItemActionTypes.CHANGE_MODAL_STATUS:
      return {
        ...state,
        modalStatus: action.payload,
      };
    default:
      return state;
  }
};

export default createFoodItemReducer;
