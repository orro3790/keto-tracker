import { combineReducers } from 'redux';
import userReducer from './user/user.reducer';
import foodItemReducer from './food-item/food-item.reducer';

export default combineReducers({
  user: userReducer,
  foodItem: foodItemReducer,
});
