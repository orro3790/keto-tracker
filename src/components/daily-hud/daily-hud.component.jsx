import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { selectHudModel } from '../../redux/daily-hud/daily-hud-actions';
import './daily-hud.styles.scss';

const DailyChart = ({
  userMacros,
  selectHudModel,
  hudModel,
  currentUser,
  entries,
}) => {
  const [dailyFats, setDailyFats] = useState('');
  const [dailyCarbs, setDailyCarbs] = useState('');
  const [dailyProtein, setDailyProtein] = useState('');
  const [dailyCalories, setDailyCalories] = useState('');

  const toggleRemaining = () => {
    selectHudModel('remaining');
    // need to update user settings in firestore next
  };

  const toggleAdditive = () => {
    selectHudModel('additive');
  };

  useEffect(() => {
    if (entries !== '') {
      setDailyFats(entries.dailyMacros.f);
      setDailyProtein(entries.dailyMacros.p);
      setDailyCarbs(entries.dailyMacros.c);
      setDailyCalories(entries.dailyMacros.e);
    }
  }, [entries]);

  // handle how to display the values, searchModal actually calculates the totals before updating firestore
  let fatsValue;
  let carbsValue;
  let proteinValue;
  let caloriesValue;

  if (hudModel === 'remaining') {
    fatsValue = (userMacros.fats - dailyFats).toFixed(1);
    carbsValue = (userMacros.carbs - dailyCarbs).toFixed(1);
    proteinValue = (userMacros.protein - dailyProtein).toFixed(1);
    caloriesValue = (userMacros.calories - dailyCalories).toFixed(1);
  } else if (hudModel === 'additive') {
    fatsValue = dailyFats;
    carbsValue = dailyCarbs;
    proteinValue = dailyProtein;
    caloriesValue = dailyCalories;
  }

  const getStyle = (className) => {
    if (className === hudModel) {
      return 'enabled';
    } else {
      return 'disabled';
    }
  };

  let macroHud;
  if (userMacros.calories === '') {
    macroHud = <div className='daily-hud-loading'>...Loading Macros</div>;
  } else {
    macroHud = (
      <div>
        <div className='calculation-model-container'>
          <div
            className={`${getStyle('remaining')} remaining`}
            onClick={toggleRemaining}
          >
            REMAINING
          </div>
          <div className='separator'></div>
          <div
            className={`${getStyle('additive')} additive`}
            onClick={toggleAdditive}
          >
            ADDITIVE
          </div>
        </div>
        <div className='daily-hud'>
          <div className='daily-fats macro-container'>
            {fatsValue}g<div className='label'>fats</div>
          </div>
          <div className='daily-carbs macro-container'>
            {carbsValue}g<div className='label'>carbs</div>
          </div>
          <div className='daily-protein macro-container'>
            {proteinValue}g<div className='label'>protein</div>
          </div>
          <div className='daily-calories macro-container'>
            {caloriesValue}
            <div className='label'>calories</div>
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
  hudModel: state.dailyHud.hudModel,
  currentUser: state.user.currentUser,
  entries: state.dateSelector.entries,
});

const mapDispatchToProps = (dispatch) => ({
  selectHudModel: (model) => dispatch(selectHudModel(model)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DailyChart);
