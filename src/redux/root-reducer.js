import { combineReducers } from 'redux';
import userReducer from './user/user.reducer';
import createFoodItemReducer from './create-food-item/create-food-item.reducer';
import foodDiaryReducer from './food-diary/food-diary.reducer';
import searchItemSuggestionReducer from './search-item-suggestion/search-item-suggestion.reducer';
import mealReducer from './meal/meal.reducer';
import dateSelectorReducer from './date-selector/date-selector.reducer';
import dailyHudSelector from './daily-hud/daily-hud-reducer';

export default combineReducers({
  user: userReducer,
  createFoodItem: createFoodItemReducer,
  foodDiary: foodDiaryReducer,
  searchItemSuggestion: searchItemSuggestionReducer,
  meal: mealReducer,
  dateSelector: dateSelectorReducer,
  dailyHud: dailyHudSelector,
});
