import { createSelector } from 'reselect';
import { RootState } from '../root-reducer';

const selectSearchItem = (state: RootState) => state.searchItem;

export const selectFoodReference = createSelector(
  [selectSearchItem],
  (searchItem) => searchItem.foodReference
);

export const selectSuggestionWindow = createSelector(
  [selectSearchItem],
  (searchItem) => searchItem.suggestionWindow
);
