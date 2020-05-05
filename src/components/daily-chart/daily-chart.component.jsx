import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './daily-chart.styles.scss';

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
      <div className='daily-hud'>
        <div className='daily-fats'>
          {(userMacros.fats - dailyFats).toFixed(1)}g
        </div>
        <div className='daily-carbs'>
          {(userMacros.carbs - dailyCarbs).toFixed(1)}g
        </div>
        <div className='daily-protein'>
          {(userMacros.protein - dailyProtein).toFixed(1)}g
        </div>
        <div className='daily-calories'>
          {(userMacros.calories - dailyCalories).toFixed(1)} cal
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
