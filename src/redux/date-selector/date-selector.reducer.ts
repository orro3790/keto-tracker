import * as DateSelectorTypes from './date-selector.types';

const INITIAL_STATE: DateSelectorTypes.State = {
  entry: '',
};

const dateSelectorReducer = (
  state = INITIAL_STATE,
  action: DateSelectorTypes.Actions
) => {
  switch (action.type) {
    case DateSelectorTypes.SET_CURRENT_DATE:
      return {
        ...state,
        dates: action.payload,
      };
    case DateSelectorTypes.SET_DIARY_ENTRY:
      return {
        ...state,
        entry: action.payload,
      };
    default:
      return state;
  }
};

export default dateSelectorReducer;
