import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './daily-chart.styles.scss';

const DailyChart = ({ dates }) => {
  const [dailyMacros, setDailyMacros] = useState({});

  useEffect(() => {}, []);

  return (
    <div className='daily-macros-container'>
      <div className='daily-fats macro'>Fats: 43/120</div>
      <div className='daily-carbs macro'>Carbs: 23/30</div>
      <div className='daily-protein macro'>Protein: 17/90</div>
      <div className='daily-calories macro'>Cal: 1120/2000</div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  dates: state.dateSelector.dates,
});

export default connect(mapStateToProps)(DailyChart);
