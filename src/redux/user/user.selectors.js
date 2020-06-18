import { createSelector } from 'reselect';

const selectUser = (state) => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  (user) => user.currentUser
);

export const selectCurrentUserId = createSelector(
  [selectUser],
  (user) => user.currentUser.id
);

export const selectCarbSettings = createSelector(
  [selectUser],
  (user) => user.currentUser.c
);

export const selectDietSettings = createSelector(
  [selectUser],
  (user) => user.currentUser.d
);

export const selectFavFoods = createSelector(
  [selectUser],
  (user) => user.favFoods
);

export const selectCustomFoods = createSelector(
  [selectUser],
  (user) => user.createdFoods
);

export const selectWaterSettings = createSelector(
  [selectUser],
  (user) => user.currentUser.w
);

export const selectMembershipSettings = createSelector(
  [selectUser],
  (user) => user.currentUser.m
);
