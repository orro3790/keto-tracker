import { UserActionTypes } from './user.types';

export const setCurrentUser = (user) => ({
  type: UserActionTypes.SET_CURRENT_USER,
  payload: user,
});

export const setFavFoods = (array) => ({
  type: UserActionTypes.SET_FAV_FOODS,
  payload: array,
});

export const setCreatedFoods = (array) => ({
  type: UserActionTypes.SET_CREATED_FOODS,
  payload: array,
});
