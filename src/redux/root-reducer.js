import { combineReducers } from 'redux';
import userReducer from './user/user.reducer';
import createFoodItemReducer from './create-food-item/create-food-item.reducer';
import foodDiaryReducer from './food-diary/food-diary.reducer';

export default combineReducers({
  user: userReducer,
  createdFoods: createFoodItemReducer,
  foodDiary: foodDiaryReducer,
});
