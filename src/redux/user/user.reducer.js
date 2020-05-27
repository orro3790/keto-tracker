import { UserActionTypes } from './user.types';

const INITIAL_STATE = {
  currentUser: null,
  userMacros: {
    fats: '',
    carbs: '',
    protein: '',
    calories: '',
  },
  favFoods: [],
  createdFoods: [],
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case UserActionTypes.SET_USER_MACROS:
      return {
        ...state,
        userMacros: action.payload,
      };
    case UserActionTypes.SET_FAV_FOODS:
      return {
        ...state,
        favFoods: action.payload,
      };
    case UserActionTypes.SET_CREATED_FOODS:
      return {
        ...state,
        createdFoods: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
