import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './daily-chart.styles.scss';
import { HorizontalBar } from 'react-chartjs-2';

const DailyChart = ({ dates, userMacros, searchModal }) => {
  const [dailyFats, setDailyFats] = useState('');
  const [dailyCarbs, setDailyCarbs] = useState('');
  const [dailyProtein, setDailyProtein] = useState('');
  const [dailyCalories, setDailyCalories] = useState('');

  useEffect(() => {
    let entriesObj;
    entriesObj = JSON.parse(localStorage.getItem('entries'));
    const todaysMeals = Object.entries(entriesObj[dates.currentDate]);
    setDailyFats(
      todaysMeals.reduce((accumulator, meal) => {
        return (accumulator += meal[1]['totals'].fats);
      }, 0)
    );
    setDailyProtein(
      todaysMeals.reduce((accumulator, meal) => {
        return (accumulator += meal[1]['totals'].protein);
      }, 0)
    );
    setDailyCarbs(
      todaysMeals.reduce((accumulator, meal) => {
        return (accumulator += meal[1]['totals'].carbs);
      }, 0)
    );
    setDailyCalories(
      todaysMeals.reduce((accumulator, meal) => {
        return (accumulator += meal[1]['totals'].calories);
      }, 0)
    );
  }, [searchModal, dates]);

  let macroHud;
  if (userMacros.calories === '') {
    macroHud = <div className='daily-hud-loading'>...Loading Macros</div>;
  } else {
    macroHud = (
      <div>
        <div className='remaining'>REMAINING</div>

        <div className='daily-hud'>
          <div className='daily-fats macro-container'>
            {(userMacros.fats - dailyFats).toFixed(1)}g
            <div className='label'>FATS</div>
          </div>
          <div className='daily-carbs macro-container'>
            {(userMacros.carbs - dailyCarbs).toFixed(1)}g
            <div className='label'>CARBS</div>
          </div>
          <div className='daily-protein macro-container'>
            {(userMacros.protein - dailyProtein).toFixed(1)}g
            <div className='label'>PROTEIN</div>
          </div>
          <div className='daily-calories macro-container'>
            {(userMacros.calories - dailyCalories).toFixed(1)}
            <div className='label'>CALORIES</div>
          </div>
        </div>
      </div>
    );
  }

  return <div>{macroHud}</div>;
};

const mapStateToProps = (state) => ({
  dates: state.dateSelector.dates,
  userMacros: state.user.userMacros,
  searchModal: state.meal.searchModal,
});

export default connect(mapStateToProps)(DailyChart);
