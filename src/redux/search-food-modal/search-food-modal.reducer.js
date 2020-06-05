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
  allowUpdateFirebase: false,
};

const searchModalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SearchModalActionTypes.TOGGLE_SEARCH_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    case SearchModalActionTypes.ALLOW_ENTRY_UPDATE_FIREBASE:
      return {
        ...state,
        allowUpdateFirebase: action.payload,
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
