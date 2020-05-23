import React, { useEffect, useState } from 'react';
import './date-selector.styles.scss';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectUpdate } from '../../redux/search-food-modal/search-food-modal.selectors';
import { selectEntries } from '../../redux/date-selector/date-selector.selectors';
import {
  setCurrentDate,
  setEntry,
} from '../../redux/date-selector/date-selector.actions';
import { updateTotals } from '../../redux/search-food-modal/search-food-modal.actions';
import { getEntry, updateEntry } from '../../firebase/firebase.utils';

const DateSelector = ({
  entries,
  currentUser,
  setEntry,
  update,
  updateTotals,
}) => {
  const [date, setDate] = useState('...loading');

  // When the user is not null, get today's diary entry from firebase
  useEffect(() => {
    const loadEntry = async () => {
      const entriesObj = await getEntry(currentUser.id, 0);
      setEntry(entriesObj);
    };

    // if a user has already loaded entries into state, no need to re-load entries into state
    if (currentUser !== null && entries === '') {
      loadEntry();
    }
  }, [currentUser, setEntry, entries]);

  // handles rendering updates to the date in UI
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

  // handles pushing updates to firestore when a change happens to entry state
  useEffect(() => {
    if (entries !== '' && currentUser !== null && update === true) {
      updateEntry(currentUser.id, entries);
      updateTotals(false);
    }
  }, [entries, currentUser, update, updateTotals]);

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
  };

  return (
    <div>
      <div className='date-c'>
        <div className='yesterday-c' onClick={goToPrevDay}>
          <i className='fas fa-chevron-left'></i>
        </div>
        <div className='today-c'>{date}</div>
        <div className='tomorrow-c' onClick={goToNextDay}>
          <i className='fas fa-chevron-right'></i>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  entries: selectEntries,
  update: selectUpdate,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentDate: (datesObj) => dispatch(setCurrentDate(datesObj)),
  setEntry: (entriesObj) => dispatch(setEntry(entriesObj)),
  updateTotals: (status) => dispatch(updateTotals(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DateSelector);
