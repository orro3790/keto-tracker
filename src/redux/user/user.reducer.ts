import * as UserTypes from './user.types';

const INITIAL_STATE: UserTypes.State = {
  currentUser: null,
  favFoods: [],
  createdFoods: [],
};

export function userReducer(
  state = INITIAL_STATE,
  action: UserTypes.Actions
): UserTypes.State {
  switch (action.type) {
    case UserTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case UserTypes.SET_CREATED_FOODS:
      return {
        ...state,
        createdFoods: action.payload,
      };
    case UserTypes.SET_FAV_FOODS:
      return {
        ...state,
        favFoods: action.payload,
      };
    default:
      return state;
  }
}

export default userReducer;
