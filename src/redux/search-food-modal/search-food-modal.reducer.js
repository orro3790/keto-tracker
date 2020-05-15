import { SearchModalActionTypes } from './search-food-modal.types';

const INITIAL_STATE = {
  searchModal: {
    status: 'hidden',
    meal: 'none',
  },
  updateTotals: false,
};

const searchModalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SearchModalActionTypes.TOGGLE_SEARCH_MODAL:
      return {
        ...state,
        searchModal: action.payload,
      };
    case SearchModalActionTypes.UPDATE_TOTALS:
      return {
        ...state,
        updateTotals: action.payload,
      };
    default:
      return state;
  }
};

export default searchModalReducer;
