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
    f: 0,
    c: 0,
    p: 0,
    e: 0,
    w: 0,
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
          f: entries.dailyMacros.f,
          c: entries.dailyMacros.c,
          p: entries.dailyMacros.p,
          e: entries.dailyMacros.e,
          w: entries.water.t,
        });
      } else {
        setDailyEntry({
          f: entries.dailyMacros.f,
          c: entries.dailyMacros.k,
          p: entries.dailyMacros.p,
          e: entries.dailyMacros.e,
          w: entries.water.t,
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
    fatsValue = (diet.f - dailyEntry.f).toFixed(0);
    carbsValue = (diet.c - dailyEntry.c).toFixed(0);
    proteinValue = (diet.p - dailyEntry.p).toFixed(0);
    caloriesValue = (diet.e - dailyEntry.e).toFixed(0);
    waterValue = waterSettings.g - dailyEntry.w;
  } else if (hudModel === 'additive') {
    fatsValue = dailyEntry.f;
    carbsValue = dailyEntry.c;
    proteinValue = dailyEntry.p;
    caloriesValue = dailyEntry.e;
    waterValue = dailyEntry.w;
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
    <div className='daily-hud-outer-c'>
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
