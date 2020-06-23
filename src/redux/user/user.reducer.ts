import {
  Actions,
  State,
  SET_CURRENT_USER,
  SET_CREATED_FOODS,
  SET_FAV_FOODS,
} from './user.types';

const INITIAL_STATE: State = {
  currentUser: null,
  favFoods: [],
  createdFoods: [],
};

export function userReducer(state = INITIAL_STATE, action: Actions): State {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case SET_CREATED_FOODS:
      return {
        ...state,
        createdFoods: action.payload,
      };
    case SET_FAV_FOODS:
      return {
        ...state,
        favFoods: action.payload,
      };
    default:
      return state;
  }
}

export default userReducer;
