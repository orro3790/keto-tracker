import { FoodDiaryActionTypes } from './food-diary.types';

export const updateFoodDatabase = (collectionMap) => ({
  type: FoodDiaryActionTypes.UPDATE_FOOD_DATABASE,
  payload: collectionMap,
});

export const createDailyMealsObj = (mealsObj) => ({
  type: FoodDiaryActionTypes.CREATE_DAILY_MEALS_OBJ,
  payload: mealsObj,
});
