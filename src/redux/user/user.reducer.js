import { UserActionTypes } from './user.types';

const INITIAL_STATE = {
  currentUser: null,
  userMacros: {
    fats: 165,
    carbs: 30,
    protein: 100,
    calories: 2005,
  },
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case UserActionTypes.GET_USER_MACROS:
      return {
        ...state,
        userMacros: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
