import { DateSelectorActionTypes } from './date-selector.types';

const INITIAL_STATE = {
  dates: '',
  entries: {
    '0-00-0000': {
      Breakfast: {
        foods: [],
        totals: {
          fats: '',
          carbs: '',
          protein: '',
          calories: '',
        },
      },
      Lunch: {
        foods: [],
        totals: {
          fats: '',
          carbs: '',
          protein: '',
          calories: '',
        },
      },
      Dinner: {
        foods: [],
        totals: {
          fats: '',
          carbs: '',
          protein: '',
          calories: '',
        },
      },
      Snacks: {
        foods: [],
        totals: {
          fats: '',
          carbs: '',
          protein: '',
          calories: '',
        },
      },
    },
  },
};

const dateSelectorReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DateSelectorActionTypes.SET_CURRENT_DATE:
      return {
        ...state,
        dates: action.payload,
      };
    case DateSelectorActionTypes.CREATE_ENTRIES_OBJ:
      return {
        ...state,
        entries: action.payload,
      };
    default:
      return state;
  }
};

export default dateSelectorReducer;
