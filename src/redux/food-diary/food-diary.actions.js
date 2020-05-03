import { FoodDiaryActionTypes } from './food-diary.types';

export const updateFoodDatabase = (collectionMap) => ({
  type: FoodDiaryActionTypes.UPDATE_FOOD_DATABASE,
  payload: collectionMap,
});
