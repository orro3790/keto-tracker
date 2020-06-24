import * as Types from './user.types';

export const setCurrentUser = (user: Types.User): Types.SetCurrentUser => ({
  type: Types.SET_CURRENT_USER,
  payload: user,
});

export const setCreatedFoods = (array: []): Types.SetCreatedFoods => ({
  type: Types.SET_CREATED_FOODS,
  payload: array,
});

export const setFavFoods = (array: []): Types.SetFavFoods => ({
  type: Types.SET_FAV_FOODS,
  payload: array,
});
