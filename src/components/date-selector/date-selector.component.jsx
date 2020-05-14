import React, { useEffect, useState } from 'react';
import './date-selector.styles.scss';
import { connect } from 'react-redux';
import {
  setCurrentDate,
  setEntry,
} from '../../redux/date-selector/date-selector.actions';
import { getEntry } from '../../firebase/firebase.utils';

const DateSelector = ({
  entries,
  setCurrentDate,
  dates,
  currentUser,
  setEntry,
}) => {
  const [date, setDate] = useState('...loading');

  // When the user is not null, get today's diary entry from firebase
  useEffect(() => {
    const loadEntry = async () => {
      const entriesObj = await getEntry(currentUser.id, 0);
      setEntry(entriesObj);
    };

    if (currentUser !== null) {
      loadEntry();
    }
  }, [currentUser, setEntry]);

  useEffect(() => {
    if (entries !== '') {
      let anchor = entries.currentDate.seconds * 1000;
      anchor = new Date(anchor);
      anchor = `${
        anchor.getMonth() + 1
      }/${anchor.getDate()}/${anchor.getFullYear()}`;
      setDate(anchor);
    }
  }, [entries]);

  const goToNextDay = () => {
    const loadEntry = async () => {
      const entriesObj = await getEntry(
        currentUser.id,
        entries.currentDate.seconds * 1000,
        +1
      );
      setEntry(entriesObj);
    };

    if (currentUser !== null) {
      loadEntry();
    }
    // console.log(entries.entry.currentDate.seconds);
  };

  const goToPrevDay = () => {
    const loadEntry = async () => {
      const entriesObj = await getEntry(
        currentUser.id,
        entries.currentDate.seconds * 1000,
        -1
      );
      setEntry(entriesObj);
    };

    if (currentUser !== null) {
      loadEntry();
    }
    // console.log(entries.entry.currentDate.seconds);
  };

  return (
    <div>
      <div className='date-container'>
        <div className='yesterday-container' onClick={goToPrevDay}>
          <i className='fas fa-chevron-left'></i>
        </div>
        <div className='today-container'>{date}</div>
        <div className='tomorrow-container' onClick={goToNextDay}>
          <i className='fas fa-chevron-right'></i>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  entries: state.dateSelector.entries,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentDate: (datesObj) => dispatch(setCurrentDate(datesObj)),
  setEntry: (entriesObj) => dispatch(setEntry(entriesObj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DateSelector);
