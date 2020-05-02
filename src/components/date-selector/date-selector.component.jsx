import React from 'react';
import './date-selector.styles.scss';
import { connect } from 'react-redux';
import {
  createEntry,
  setCurrentDate,
} from '../../redux/food-diary/food-diary.actions';

const DateSelector = ({ entries, createEntry, setCurrentDate }) => {
  // instantiate currentDate obj and prevDay nextDay copies to prevent mutability when doing computations
  let currentDate = new Date();
  let prevDate = new Date(currentDate);
  let nextDate = new Date(currentDate);

  prevDate.setDate(currentDate.getDate() - 1);
  nextDate.setDate(currentDate.getDate() + 1);

  currentDate = currentDate.toLocaleDateString();
  prevDate = prevDate.toLocaleDateString();
  nextDate = nextDate.toLocaleDateString();

  const dates = {
    currentDate: currentDate,
    prevDate: prevDate,
    nextDate: nextDate,
  };

  setCurrentDate(dates);

  // if entries obj in localStorage, use it for rendering, else use the entries object in state
  let entriesObj;
  entriesObj = JSON.parse(localStorage.getItem('entries'));
  if (entriesObj !== undefined && entriesObj !== null) {
    // console.log('date selector retrieved entriesObj');
    // console.log(entriesObj);
  } else {
    entriesObj = entries;
  }

  // get current date and instantiate a meals obj for today if one doesn't already exist
  if (!Object.keys(entriesObj).includes(currentDate)) {
    const newEntry = {
      [currentDate]: {
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
    };
    // copy entries and append newEntry to it
    const copy = Object.assign({}, entries, newEntry);
    createEntry(copy);

    // add the updated entryObj to localStorage
    localStorage.setItem('entries', JSON.stringify(copy));
  }

  return (
    <div>
      <div className='date-container'>
        <div className='yesterday-container'>{dates.prevDate}</div>
        <div className='today-container'>{dates.currentDate}</div>
        <div className='tomorrow-container'>{dates.nextDate}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  entries: state.foodDiary.entries,
});

const mapDispatchToProps = (dispatch) => ({
  createEntry: (entries) => dispatch(createEntry(entries)),
  setCurrentDate: (currentDate) => dispatch(setCurrentDate(currentDate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DateSelector);
