import { createSelector } from 'reselect';

const selectSearchItem = (state) => state.searchItem;

export const selectFoodReference = createSelector(
  [selectSearchItem],
  (searchItem) => searchItem.foodReference
);

export const selectSuggestionWindow = createSelector(
  [selectSearchItem],
  (searchItem) => searchItem.selectSuggestionWindow
);
