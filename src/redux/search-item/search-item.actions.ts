import * as Types from './../search-item/search-item.types';

export const createFoodReference = (
  food: Types.Food | ''
): Types.CreateFoodReference => ({
  type: Types.CREATE_FOOD_REFERENCE,
  payload: food,
});

export const toggleSuggestionWindow = (
  status: Types.Visibility
): Types.ToggleSuggestionWindow => ({
  type: Types.TOGGLE_SUGGESTION_WINDOW,
  payload: status,
});
