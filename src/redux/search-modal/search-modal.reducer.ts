import {
  State,
  Actions,
  TOGGLE_SEARCH_MODAL,
  ALLOW_ENTRY_UPDATE_FIREBASE,
  SET_FOOD_FILTER,
} from './search-modal.types';

const INITIAL_STATE: State = {
  modal: {
    status: 'hidden',
    meal: '',
    editMode: {
      enabled: false,
      food: '',
      index: '',
    },
  },
  foodFilter: {
    filter: 'usda',
    path: 'usda',
  },
  allowUpdateFirebase: false,
};

const searchModalReducer = (state = INITIAL_STATE, action: Actions): State => {
  switch (action.type) {
    case TOGGLE_SEARCH_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    case ALLOW_ENTRY_UPDATE_FIREBASE:
      return {
        ...state,
        allowUpdateFirebase: action.payload,
      };
    case SET_FOOD_FILTER:
      return {
        ...state,
        foodFilter: action.payload,
      };
    default:
      return state;
  }
};

export default searchModalReducer;
