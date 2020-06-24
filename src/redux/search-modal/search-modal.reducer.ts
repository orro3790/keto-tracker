import * as Types from './search-modal.types';

const INITIAL_STATE: Types.State = {
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

const searchModalReducer = (
  state = INITIAL_STATE,
  action: Types.Actions
): Types.State => {
  switch (action.type) {
    case Types.TOGGLE_SEARCH_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    case Types.ALLOW_ENTRY_UPDATE_FIREBASE:
      return {
        ...state,
        allowUpdateFirebase: action.payload,
      };
    case Types.SET_FOOD_FILTER:
      return {
        ...state,
        foodFilter: action.payload,
      };
    default:
      return state;
  }
};

export default searchModalReducer;
