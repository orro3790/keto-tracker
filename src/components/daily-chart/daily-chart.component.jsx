import React from 'react';
import { connect } from 'react-redux';
import './daily-chart.styles.scss';

const DailyChart = ({ dates, userMacros }) => {
  // useEffect(() => {
  //   effect
  //   return () => {
  //     cleanup
  //   }
  // }, [input])

  return (
    <div className='daily-hud'>
      <div className='daily-fats'>{userMacros.fats}g</div>
      <div className='daily-carbs'>{userMacros.carbs}g</div>
      <div className='daily-protein'>{userMacros.protein}g</div>
      <div className='daily-calories'>{userMacros.calories} cal</div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  dates: state.dateSelector.dates,
  userMacros: state.user.userMacros,
});

export default connect(mapStateToProps)(DailyChart);
