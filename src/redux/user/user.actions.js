import { UserActionTypes } from './user.types';

export const setCurrentUser = (user) => ({
  type: UserActionTypes.SET_CURRENT_USER,
  payload: user,
});

export const setUserMacros = (macros) => ({
  type: UserActionTypes.SET_USER_MACROS,
  payload: macros,
});
