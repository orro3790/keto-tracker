import React from 'react';
import './date-selector.styles.scss';
import { connect } from 'react-redux';

const DateSelector = ({ dates }) => {
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
  dates: state.foodDiary.dates,
});

export default connect(mapStateToProps)(DateSelector);
