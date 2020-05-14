import { DateSelectorActionTypes } from './date-selector.types';

const INITIAL_STATE = {
  entries: '',
};

const dateSelectorReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DateSelectorActionTypes.SET_CURRENT_DATE:
      return {
        ...state,
        dates: action.payload,
      };
    case DateSelectorActionTypes.SET_DIARY_ENTRY:
      return {
        ...state,
        entries: action.payload,
      };
    default:
      return state;
  }
};

export default dateSelectorReducer;
