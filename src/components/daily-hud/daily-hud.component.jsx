import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { selectHudModel } from '../../redux/daily-hud/daily-hud-actions';
import './daily-hud.styles.scss';

const DailyChart = ({ selectHudModel, hudModel, currentUser, entries }) => {
  const [dailyFats, setDailyFats] = useState('');
  const [dailyCarbs, setDailyCarbs] = useState('');
  const [dailyProtein, setDailyProtein] = useState('');
  const [dailyCalories, setDailyCalories] = useState('');

  const toggleRemaining = () => {
    selectHudModel('remaining');
  };

  const toggleAdditive = () => {
    selectHudModel('additive');
  };

  useEffect(() => {
    if (currentUser !== null && entries !== '') {
      setDailyFats(entries.dailyMacros.f);
      setDailyProtein(entries.dailyMacros.p);
      if (currentUser.carbSettings === 'net') {
        setDailyCarbs(entries.dailyMacros.k);
      } else {
        setDailyCarbs(entries.dailyMacros.c);
      }
      setDailyCalories(entries.dailyMacros.e);
    }
  }, [entries, currentUser]);

  // handle how to display the values, searchModal actually calculates the totals before updating firestore
  let fatsValue = 0;
  let carbsValue = 0;
  let proteinValue = 0;
  let caloriesValue = 0;
  let carbLabel = 'carbs';

  if (currentUser !== null) {
    if (currentUser.carbSettings === 'net') {
      carbLabel = 'net carbs';
    } else {
      carbLabel = 'carbs';
    }
    if (hudModel === 'remaining') {
      fatsValue = (currentUser.diet.fats - dailyFats).toFixed(1);
      carbsValue = (currentUser.diet.carbs - dailyCarbs).toFixed(1);
      proteinValue = (currentUser.diet.protein - dailyProtein).toFixed(1);
      caloriesValue = (currentUser.diet.calories - dailyCalories).toFixed(1);
    } else if (hudModel === 'additive') {
      fatsValue = dailyFats;
      carbsValue = dailyCarbs;
      proteinValue = dailyProtein;
      caloriesValue = dailyCalories;
    }
  }

  const getStyle = (className) => {
    if (className === hudModel) {
      return 'enabled';
    } else {
      return 'disabled';
    }
  };

  let macroHud;
  if (currentUser !== null && currentUser.diet.calories === '') {
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
            DAILY SUM
          </div>
        </div>
        <div className='daily-hud'>
          <div className='daily-fats macro-container'>
            {fatsValue}g<div className='label'>fats</div>
          </div>
          <div className='daily-carbs macro-container'>
            {carbsValue}g<div className='label'>{carbLabel}</div>
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
  hudModel: state.dailyHud.hudModel,
  currentUser: state.user.currentUser,
  entries: state.dateSelector.entries,
});

const mapDispatchToProps = (dispatch) => ({
  selectHudModel: (model) => dispatch(selectHudModel(model)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DailyChart);
