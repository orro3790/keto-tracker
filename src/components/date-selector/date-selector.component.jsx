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
import { allowUpdateFirebase } from '../../redux/search-food-modal/search-food-modal.actions';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {
  getEntry,
  updateEntry,
  updateMetricsData,
} from '../../firebase/firebase.utils';
import Tippy from '@tippyjs/react';
import Calendar from 'react-calendar';
import './calendar.scss';

const DateSelector = ({
  entries,
  currentUser,
  setEntry,
  update,
  allowUpdateFirebase,
}) => {
  const [date, setDate] = useState('');
  const [calDate, setCalDate] = useState(new Date());

  const onChange = (calDate) => {
    const loadEntry = async () => {
      const entriesObj = await getEntry(currentUser.id, calDate.getTime());
      setEntry(entriesObj);
    };
    loadEntry().then(() => setCalDate(calDate));
  };

  // When the user is not null, get today's diary entry from firebase
  useEffect(() => {
    const loadEntry = async () => {
      const entriesObj = await getEntry(currentUser.id, 0);
      setEntry(entriesObj);
    };

    // if a user has already loaded entries into state, no need to re-load entries into state
    if (entries === '') {
      loadEntry();
    }
  }, [currentUser, setEntry, entries]);

  // handles rendering updates to the date in UI
  useEffect(() => {
    if (entries !== '') {
      let anchor = new Date(entries.currentDate.seconds * 1000);
      setCalDate(anchor);

      anchor = `${
        anchor.getMonth() + 1
      }/${anchor.getDate()}/${anchor.getFullYear()}`;
      setDate(anchor);
    }
  }, [entries]);

  // handles pushing updates to firestore when a change happens to entry state, then sets update state back to false
  useEffect(() => {
    if (entries !== '' && currentUser !== null && update === true) {
      updateEntry(currentUser.id, entries);
      updateMetricsData(currentUser);
      allowUpdateFirebase(false);
    }
  }, [entries, currentUser, update, allowUpdateFirebase]);

  const goToNextDay = () => {
    const loadEntry = async () => {
      const entriesObj = await getEntry(
        currentUser.id,
        entries.currentDate.seconds * 1000,
        +1
      );
      setEntry(entriesObj);
    };
    loadEntry();
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

    loadEntry();
  };

  return (
    <div className='date-selector-c'>
      <div className='yesterday-c' onClick={goToPrevDay}>
        <FaChevronLeft className='fas fa-chevron-left' />
      </div>

      <div>
        <Tippy
          interactive={true}
          content={<Calendar onChange={onChange} value={calDate} />}
        >
          <div className='today-c'>{date}</div>
        </Tippy>
      </div>

      <div className='tomorrow-c' onClick={goToNextDay}>
        <FaChevronRight className='fas fa-chevron-right' />
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
  allowUpdateFirebase: (status) => dispatch(allowUpdateFirebase(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DateSelector);
