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
  const [dailyEntry, setDailyEntry] = useState({
    fats: 0,
    carbs: 0,
    protein: 0,
    calories: 0,
    water: 0,
  });

  const toggleRemaining = () => {
    setHudModel('remaining');
  };

  const toggleAdditive = () => {
    setHudModel('additive');
  };

  const getStyle = (className) => {
    if (className === hudModel) {
      return 'on';
    } else {
      return 'off';
    }
  };

  useEffect(() => {
    if (entries !== '') {
      if (carbSettings === 't') {
        setDailyEntry({
          fats: entries.dailyMacros.f,
          carbs: entries.dailyMacros.c,
          protein: entries.dailyMacros.p,
          calories: entries.dailyMacros.e,
          water: entries.water.t,
        });
      } else {
        setDailyEntry({
          fats: entries.dailyMacros.f,
          carbs: entries.dailyMacros.k,
          protein: entries.dailyMacros.p,
          calories: entries.dailyMacros.e,
          water: entries.water.t,
        });
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
    fatsValue = (diet.fats - dailyEntry.fats).toFixed(0);
    carbsValue = (diet.carbs - dailyEntry.carbs).toFixed(0);
    proteinValue = (diet.protein - dailyEntry.protein).toFixed(0);
    caloriesValue = (diet.calories - dailyEntry.calories).toFixed(0);
    waterValue = waterSettings.g - dailyEntry.water;
  } else if (hudModel === 'additive') {
    fatsValue = dailyEntry.fats;
    carbsValue = dailyEntry.carbs;
    proteinValue = dailyEntry.protein;
    caloriesValue = dailyEntry.calories;
    waterValue = dailyEntry.water;
  }

  // conditionally render daily water intake based on user's unit preference, then adjust decimal display
  switch (waterSettings.u) {
    case 'cups':
      waterValue = (waterValue / 250).toFixed(2);
      break;
    case 'oz':
      waterValue = (waterValue / 29.5735).toFixed(2);
      break;
    case 'mL':
      waterValue = waterValue.toFixed(0);
      break;
    default:
      break;
  }

  let waterCol;
  let waterUnit = waterSettings.u;

  // if waterUnit is 'cups' ==> handle singular form of 'cups' hud display
  if (waterSettings.u === 'cups') {
    if (dailyEntry.water === 1) {
      waterUnit = 'cup';
    }
  }

  if (waterSettings.e === true) {
    waterCol = (
      <div className='water-c'>
        <div>
          {waterValue} {waterUnit}
        </div>
        <div className='droplet'>
          <GiWaterDrop />
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
