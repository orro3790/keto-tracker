import { combineReducers } from 'redux';
import userReducer from './user/user.reducer';
import createFoodItemReducer from './create-food-item/create-food-item.reducer';

export default combineReducers({
  user: userReducer,
  createdFoods: createFoodItemReducer,
});
