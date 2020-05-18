import { combineReducers } from 'redux';
import userReducer from './user/user.reducer';
import searchItemSuggestionReducer from './search-item-suggestion/search-item-suggestion.reducer';
import searchModalReducer from './search-food-modal/search-food-modal.reducer';
import dateSelectorReducer from './date-selector/date-selector.reducer';
import dailyHudSelector from './daily-hud/daily-hud-reducer';
import createFoodReducer from './create-food/create-food.reducer';

export default combineReducers({
  user: userReducer,
  searchItemSuggestion: searchItemSuggestionReducer,
  searchModal: searchModalReducer,
  dateSelector: dateSelectorReducer,
  dailyHud: dailyHudSelector,
  createFood: createFoodReducer,
});
