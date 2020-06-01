import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCarbSettings,
  selectDietSettings,
  selectWaterSettings,
} from '../../redux/user/user.selectors';
import { selectEntries } from '../../redux/date-selector/date-selector.selectors';
import { selectHudSettings } from '../../redux/daily-hud/daily-hud.selectors';
import { setHudModel } from '../../redux/daily-hud/daily-hud-actions';
import { GiWaterDrop } from 'react-icons/gi';
import './daily-hud.styles.scss';

const DailyChart = ({
  setHudModel,
  carbSettings,
  diet,
  hudModel,
  entries,
  waterSettings,
}) => {
  const [dailyFats, setDailyFats] = useState('');
  const [dailyCarbs, setDailyCarbs] = useState('');
  const [dailyProtein, setDailyProtein] = useState('');
  const [dailyCalories, setDailyCalories] = useState('');
  const [dailyWater, setDailyWater] = useState('');

  const toggleRemaining = () => {
    setHudModel('remaining');
  };

  const toggleAdditive = () => {
    setHudModel('additive');
  };

  useEffect(() => {
    if (entries !== '') {
      setDailyFats(entries.dailyMacros.f);
      setDailyProtein(entries.dailyMacros.p);
      setDailyCalories(entries.dailyMacros.e);
      setDailyWater(entries.water.c);
      if (carbSettings === 'n') {
        setDailyCarbs(entries.dailyMacros.k);
      } else {
        setDailyCarbs(entries.dailyMacros.c);
      }
    }
  }, [entries, carbSettings]);

  // handle how to display the values, searchModal actually calculates the totals before updating firestore
  let fatsValue = 0;
  let carbsValue = 0;
  let proteinValue = 0;
  let caloriesValue = 0;
  let waterValue = 0;
  let carbLabel = 'carbs';

  if (carbSettings === 'n') {
    carbLabel = 'net carbs';
  } else {
    carbLabel = 'carbs';
  }
  if (hudModel === 'remaining') {
    fatsValue = (diet.fats - dailyFats).toFixed(1);
    carbsValue = (diet.carbs - dailyCarbs).toFixed(1);
    proteinValue = (diet.protein - dailyProtein).toFixed(1);
    caloriesValue = (diet.calories - dailyCalories).toFixed(1);
    waterValue = waterSettings.g - dailyWater;
  } else if (hudModel === 'additive') {
    fatsValue = dailyFats;
    carbsValue = dailyCarbs;
    proteinValue = dailyProtein;
    caloriesValue = dailyCalories;
    waterValue = dailyWater;
  }

  const getStyle = (className) => {
    if (className === hudModel) {
      return 'on';
    } else {
      return 'off';
    }
  };

  let waterCol;
  let waterUnit = waterSettings.u;

  if (waterSettings.u === 'cups') {
    if (dailyWater === 1) {
      waterUnit = 'cup';
    }
  }

  if (waterSettings.e === true) {
    waterCol = (
      <div className='water-c'>
        <div className='droplet'>
          <GiWaterDrop />
        </div>
        <div>
          {waterValue} {waterUnit}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='calculation-c'>
        <div className={`${getStyle('remaining')} remaining`}>
          <div></div>
          <div className='btn' onClick={toggleRemaining}>
            REMAINING
          </div>
        </div>
        <div className='separator'></div>
        <div className={`${getStyle('additive')} additive`}>
          <div className='btn' onClick={toggleAdditive}>
            DAILY SUM
          </div>
          <div></div>
        </div>
      </div>
      <div className='daily-hud'>
        {waterCol}
        <div className='fats macro-c'>
          {fatsValue}g<div className='l'>fats</div>
        </div>
        <div className='carbs macro-c'>
          {carbsValue}g<div className='l'>{carbLabel}</div>
        </div>
        <div className='protein macro-c'>
          {proteinValue}g<div className='l'>protein</div>
        </div>
        <div className=' macro-c'>
          {caloriesValue}
          <div className='l'>calories</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  hudModel: selectHudSettings,
  entries: selectEntries,
  carbSettings: selectCarbSettings,
  diet: selectDietSettings,
  waterSettings: selectWaterSettings,
});

const mapDispatchToProps = (dispatch) => ({
  setHudModel: (model) => dispatch(setHudModel(model)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DailyChart);
