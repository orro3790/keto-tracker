import { MealActionTypes } from './meal.types';

export const createFoodItem = (food) => ({
  type: MealActionTypes.ADD_FOOD_TO_MEAL,
  payload: food,
});
