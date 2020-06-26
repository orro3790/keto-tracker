import React, { useEffect, useState } from 'react';
import './date-selector.styles.scss';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCurrentUserId,
  selectMembershipSettings,
  selectDietSettings,
  selectWaterSettings,
} from '../../redux/user/user.selectors';
import { selectUpdate } from '../../redux/search-modal/search-modal.selectors';
import { selectEntry } from '../../redux/date-selector/date-selector.selectors';
import {
  setCurrentDate,
  setEntry,
} from '../../redux/date-selector/date-selector.actions';
import { allowUpdateFirebase } from '../../redux/search-modal/search-modal.actions';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {
  getEntry,
  updateEntry,
  updateMetricsData,
} from '../../firebase/firebase.utils';
import Tippy from '@tippyjs/react';
import Calendar from 'react-calendar';
import { RootState } from '../../redux/root-reducer';
import * as TSearchModal from '../../redux/search-modal/search-modal.types';
import * as TDateSelector from '../../redux/date-selector/date-selector.types';
import * as TUser from '../../redux/user/user.types';
import './calendar.scss';

type Props = PropsFromRedux;

const DateSelector = ({
  entry,
  userId,
  dietSettings,
  waterSettings,
  membership,
  setEntry,
  update,
  allowUpdateFirebase,
}: Props) => {
  const [date, setDate] = useState<string>('');
  const [calDate, setCalDate] = useState(new Date());

  // handles getting the entry when a user clicks on a date in the calendar picker
  const onChange = (calDate: Date | Date[]) => {
    const loadEntry = async () => {
      // if a user clicks a date on calendar picker, pass calDate.getTime() as the anchor date
      const entriesObj = await getEntry(
        userId,
        dietSettings,
        waterSettings,
        (calDate as Date).getTime()
      );
      setEntry(entriesObj);
    };
    loadEntry().then(() => setCalDate(calDate as Date));
  };

  // When the user is not null, get today's diary entry from firebase
  useEffect(() => {
    const loadEntry = async () => {
      const entriesObj = await getEntry(userId, dietSettings, waterSettings);
      setEntry(entriesObj);
    };

    if (entry === '') {
      loadEntry();
    }
  }, [userId, dietSettings, waterSettings, setEntry, entry]);

  // handles rendering updates to the date in UI
  useEffect(() => {
    if (entry !== '') {
      let anchor = new Date(entry.t.seconds * 1000);
      setCalDate(anchor);

      let dateUI = `${
        anchor.getMonth() + 1
      }/${anchor.getDate()}/${anchor.getFullYear()}`;
      setDate(dateUI);
    }
  }, [entry]);

  // handles updating firestore when update toggle is true
  useEffect(() => {
    if (entry !== '' && userId !== null && update === true) {
      updateEntry(userId, entry);
      // if the user's membership is premium, check whether to update metrics
      updateMetricsData(userId, membership);
      // after update has completed, close the gate to prevent any unintended writes later
      allowUpdateFirebase(false);
    }
  }, [entry, userId, membership, update, allowUpdateFirebase]);

  const goToNextDay = () => {
    const loadEntry = async () => {
      const entriesObj = await getEntry(
        userId,
        dietSettings,
        waterSettings,
        (entry as TDateSelector.Entry).t.seconds * 1000,
        +1
      );
      setEntry(entriesObj);
    };
    loadEntry();
  };

  const goToPrevDay = () => {
    const loadEntry = async () => {
      const entriesObj = await getEntry(
        userId,
        dietSettings,
        waterSettings,
        (entry as TDateSelector.Entry).t.seconds * 1000,
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
          trigger='click'
          content={<Calendar onChange={onChange} value={calDate} />}
          animation={'scale'}
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

interface Selectors {
  userId: string | undefined;
  membership: 's' | 'p' | undefined;
  entry: TDateSelector.Entry | '';
  update: boolean;
  dietSettings: TUser.Diet | undefined;
  waterSettings: TUser.WaterSettings | undefined;
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  userId: selectCurrentUserId,
  membership: selectMembershipSettings,
  entry: selectEntry,
  update: selectUpdate,
  dietSettings: selectDietSettings,
  waterSettings: selectWaterSettings,
});

type Actions =
  | TDateSelector.SetCurrentDate
  | TDateSelector.SetEntry
  | TSearchModal.AllowUpdateFirebase;

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  setCurrentDate: (object: object) => dispatch(setCurrentDate(object)),
  setEntry: (object: TDateSelector.Entry) => dispatch(setEntry(object)),
  allowUpdateFirebase: (status: boolean) =>
    dispatch(allowUpdateFirebase(status)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DateSelector);
