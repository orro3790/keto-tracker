import { combineReducers } from 'redux';
import { userReducer } from './user/user.reducer';
import searchItemReducer from './search-item/search-item.reducer';
import searchModalReducer from './search-modal/search-modal.reducer';
import dateSelectorReducer from './date-selector/date-selector.reducer';
import dailyHudSelector from './daily-hud/daily-hud-reducer';
import createFoodReducer from './create-food/create-food.reducer';
import FavsModalReducer from './favs-modal/favs-modal.reducer';
import customFoodsModalReducer from './custom-foods-modal/custom-foods-modal.reducer';
import alertModalReducer from './alert-modal/alert-modal.reducer';
import waterModalReducer from './water-modal/water-modal.reducer';
import metricsReducer from './metrics/metrics.reducer';

const rootReducer = combineReducers({
  user: userReducer,
  searchItem: searchItemReducer,
  searchModal: searchModalReducer,
  dateSelector: dateSelectorReducer,
  dailyHud: dailyHudSelector,
  createFood: createFoodReducer,
  favsModal: FavsModalReducer,
  customFoodsModal: customFoodsModalReducer,
  alertModal: alertModalReducer,
  waterModal: waterModalReducer,
  metrics: metricsReducer,
});

// Note that we do not have to explicitly declare a new interface for RootState. We can use ReturnType to infer state shape from the rootReducer.
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
