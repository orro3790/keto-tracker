import React, { useEffect } from 'react';
import './date-selector.styles.scss';
import { connect } from 'react-redux';
import { setCurrentDate } from '../../redux/date-selector/date-selector.actions';
import {
  instantiateDatesObj,
  instantiateEntriesObj,
} from './date-selector.utils.js';
import { createDateSelector } from '../../firebase/firebase.utils';

const DateSelector = ({ entries, setCurrentDate, dates, currentUser }) => {
  // When the user is not null, fetch the dateSelector obj from firebase
  useEffect(() => {
    if (currentUser !== null) {
      createDateSelector(currentUser.id);
    }
    // return () => {
    //   cleanup
    // }
  }, [currentUser]);

  // if entries obj in localStorage, use it for rendering, else use the initial state entries object
  let entriesObj = JSON.parse(localStorage.getItem('entries'));
  if (entriesObj !== undefined && entriesObj !== null) {
  } else {
    entriesObj = entries;
  }

  // check to see if a datesObj exists in cache, which can use its currentDate to anchor the date
  let datesObj = JSON.parse(localStorage.getItem('dates'));
  // if the datesObj is null, instantiate one using today's date
  datesObj = instantiateDatesObj(datesObj);

  // if currentDate not included in the entriesObj --> instantiate new entriesObj that includes it --> add to LS
  instantiateEntriesObj(entriesObj, datesObj);

  // update dates state only if difference in datesObj in LS and dates state, preventing infinite renders upon mount
  if (datesObj.currentDate !== dates.currentDate) {
    setCurrentDate(datesObj);
  }

  const goToPrevDay = () => {
    // if entries obj in localStorage, use it for rendering, else use the entries object in state
    entriesObj = JSON.parse(localStorage.getItem('entries'));
    if (entriesObj !== undefined && entriesObj !== null) {
    } else {
      entriesObj = entries;
    }

    let dateShift;
    dateShift = JSON.parse(localStorage.getItem('dates'));

    let today = new Date();
    let currentDate = new Date(dateShift.currentDate);
    let prevDate = new Date(dateShift.currentDate);
    let nextDate = new Date(dateShift.currentDate);

    currentDate.setDate(currentDate.getDate() - 1);
    prevDate.setDate(prevDate.getDate() - 2);
    nextDate.setDate(nextDate.getDate());

    today = today.toLocaleDateString();
    currentDate = currentDate.toLocaleDateString();
    prevDate = prevDate.toLocaleDateString();
    nextDate = nextDate.toLocaleDateString();

    dateShift = {
      today: today,
      currentDate: currentDate,
      prevDate: prevDate,
      nextDate: nextDate,
    };

    instantiateEntriesObj(entriesObj, dateShift);

    // get current date and instantiate a meals obj for today if one doesn't already exist

    localStorage.setItem('dates', JSON.stringify(dateShift));
    setCurrentDate(dateShift);
  };

  const goToNextDay = () => {
    // if entries obj in localStorage, use it for rendering, else use the entries object in state
    entriesObj = JSON.parse(localStorage.getItem('entries'));
    if (entriesObj !== undefined && entriesObj !== null) {
    } else {
      entriesObj = entries;
    }

    let dateShift;
    dateShift = JSON.parse(localStorage.getItem('dates'));

    let today = new Date();
    let currentDate = new Date(dateShift.currentDate);
    let prevDate = new Date(dateShift.currentDate);
    let nextDate = new Date(dateShift.currentDate);

    currentDate.setDate(currentDate.getDate() + 1);
    prevDate.setDate(prevDate.getDate());
    nextDate.setDate(nextDate.getDate() + 2);

    today = today.toLocaleDateString();
    currentDate = currentDate.toLocaleDateString();
    prevDate = prevDate.toLocaleDateString();
    nextDate = nextDate.toLocaleDateString();

    dateShift = {
      today: today,
      currentDate: currentDate,
      prevDate: prevDate,
      nextDate: nextDate,
    };

    instantiateEntriesObj(entriesObj, dateShift);

    localStorage.setItem('dates', JSON.stringify(dateShift));
    setCurrentDate(dateShift);
  };

  useEffect(() => {
    // re-render component when dates state changes
  }, [dates]);

  return (
    <div>
      <div className='date-container'>
        <div className='yesterday-container' onClick={goToPrevDay}>
          <i className='fas fa-chevron-left'></i>
        </div>
        <div className='today-container'>{dates.currentDate}</div>
        <div className='tomorrow-container' onClick={goToNextDay}>
          <i className='fas fa-chevron-right'></i>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  entries: state.dateSelector.entries,
  dates: state.dateSelector.dates,
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentDate: (datesObj) => dispatch(setCurrentDate(datesObj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DateSelector);
