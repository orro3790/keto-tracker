import * as UserTypes from './user.types';

// TypeScript infers that this function is returning SetUserAction
export const setCurrentUser = (user: UserTypes.User): UserTypes.Actions => ({
  type: UserTypes.SET_CURRENT_USER,
  payload: user,
});

// TypeScript infers that this function is returning SetCreatedFoodsAction
export const setCreatedFoods = (array: []): UserTypes.Actions => ({
  type: UserTypes.SET_CREATED_FOODS,
  payload: array,
});

// TypeScript infers that this function is returning SetFavFoodsAction
export const setFavFoods = (array: []): UserTypes.Actions => ({
  type: UserTypes.SET_FAV_FOODS,
  payload: array,
});
