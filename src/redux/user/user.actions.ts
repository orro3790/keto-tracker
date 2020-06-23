import {
  User,
  Actions,
  SET_CURRENT_USER,
  SET_CREATED_FOODS,
  SET_FAV_FOODS,
} from './user.types';

// TypeScript infers that this function is returning SetUserAction
export const setCurrentUser = (user: User): Actions => ({
  type: SET_CURRENT_USER,
  payload: user,
});

// TypeScript infers that this function is returning SetCreatedFoodsAction
export const setCreatedFoods = (array: []): Actions => ({
  type: SET_CREATED_FOODS,
  payload: array,
});

// TypeScript infers that this function is returning SetFavFoodsAction
export const setFavFoods = (array: []): Actions => ({
  type: SET_FAV_FOODS,
  payload: array,
});
