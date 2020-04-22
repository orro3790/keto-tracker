import { combineReducers } from 'redux';
import userReducer from './user/user.reducer';
import createFoodItemReducer from './create-food-item/create-food-item.reducer';
import foodDiaryReducer from './food-diary/food-diary.reducer';
import searchItemSuggestionReducer from './search-item-suggestion/search-item-suggestion.reducer';

export default combineReducers({
  user: userReducer,
  createFoodItem: createFoodItemReducer,
  foodDiary: foodDiaryReducer,
  searchItemSuggestion: searchItemSuggestionReducer,
});
