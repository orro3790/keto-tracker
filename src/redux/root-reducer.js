import { combineReducers } from 'redux';
import userReducer from './user/user.reducer';
import searchItemReducer from './search-item/search-item.reducer';
import searchModalReducer from './search-food-modal/search-food-modal.reducer';
import dateSelectorReducer from './date-selector/date-selector.reducer';
import dailyHudSelector from './daily-hud/daily-hud-reducer';
import createFoodReducer from './create-food/create-food.reducer';
import viewFavsReducer from './favs-modal/favs-modal.reducer';

export default combineReducers({
  user: userReducer,
  searchItem: searchItemReducer,
  searchModal: searchModalReducer,
  dateSelector: dateSelectorReducer,
  dailyHud: dailyHudSelector,
  createFood: createFoodReducer,
  viewFavs: viewFavsReducer,
});
