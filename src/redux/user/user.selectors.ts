import { createSelector } from 'reselect';
import { RootState } from './../root-reducer';

const selectUser = (state: RootState) => state.user;

export const selectCurrentUser = createSelector([selectUser], (user) => {
  return user.currentUser;
});

export const selectCurrentUserId = createSelector([selectUser], (user) => {
  return user.currentUser?.id;
});

export const selectCarbSettings = createSelector([selectUser], (user) => {
  return user.currentUser?.c;
});

export const selectDietSettings = createSelector([selectUser], (user) => {
  return user.currentUser?.d;
});

export const selectFavFoods = createSelector([selectUser], (user) => {
  return user.favFoods;
});

export const selectCustomFoods = createSelector([selectUser], (user) => {
  return user.createdFoods;
});

export const selectWaterSettings = createSelector([selectUser], (user) => {
  return user.currentUser?.w;
});

export const selectMembershipSettings = createSelector([selectUser], (user) => {
  return user.currentUser?.m;
});
