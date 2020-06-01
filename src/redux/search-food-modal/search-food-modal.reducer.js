import { SearchModalActionTypes } from './search-food-modal.types';

const INITIAL_STATE = {
  modal: {
    status: 'hidden',
    meal: '',
    editMode: false,
    foodToEdit: '',
    listId: '',
  },
  foodFilter: {
    filter: 'usda',
    path: 'usda',
  },
  updateFirebase: false,
};

const searchModalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SearchModalActionTypes.TOGGLE_SEARCH_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    case SearchModalActionTypes.UPDATE_TOTALS:
      return {
        ...state,
        updateFirebase: action.payload,
      };
    case SearchModalActionTypes.SET_FOOD_FILTER:
      return {
        ...state,
        foodFilter: action.payload,
      };
    default:
      return state;
  }
};

export default searchModalReducer;
