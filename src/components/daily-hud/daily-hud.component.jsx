import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCarbSettings,
  selectWaterSettings,
} from '../../redux/user/user.selectors';
import { selectEntry } from '../../redux/date-selector/date-selector.selectors';
import { selectHudSettings } from '../../redux/daily-hud/daily-hud.selectors';
import { setHudModel } from '../../redux/daily-hud/daily-hud-actions';
import { GiWaterDrop } from 'react-icons/gi';
import './daily-hud.styles.scss';

const DailyChart = ({
  setHudModel,
  carbSettings,
  hudModel,
  entry,
  waterSettings,
}) => {
  const [dailyEntry, setDailyEntry] = useState({
    f: 0,
    c: 0,
    k: 0,
    p: 0,
    e: 0,
    w: 0,
    diet: {
      f: 0,
      c: 0,
      k: 0,
      p: 0,
      e: 0,
    },
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

  console.log(dailyEntry.diet);

  useEffect(() => {
    if (entry !== '') {
      setDailyEntry({
        f: entry.dailyMacros.f,
        c: entry.dailyMacros.c,
        k: entry.dailyMacros.k,
        p: entry.dailyMacros.p,
        e: entry.dailyMacros.e,
        w: entry.water.t,
        diet: {
          f: entry.goals.diet.snapshot.f,
          c: entry.goals.diet.snapshot.c,
          p: entry.goals.diet.snapshot.p,
          e: entry.goals.diet.snapshot.e,
        },
      });
    }
  }, [entry, carbSettings]);

  // handle how to display the values
  let fatsValue,
    carbsValue,
    proteinValue,
    caloriesValue,
    waterValue = 0;

  let carbLabel = 'carbs';

  if (carbSettings === 'n') {
    carbLabel = 'net carbs';
  } else {
    carbLabel = 'carbs';
  }

  if (hudModel === 'remaining') {
    fatsValue = (dailyEntry.diet.f - dailyEntry.f).toFixed(1);
    carbsValue =
      carbSettings === 'n'
        ? (dailyEntry.diet.c - dailyEntry.k).toFixed(1)
        : (dailyEntry.diet.c - dailyEntry.c).toFixed(1);
    proteinValue = (dailyEntry.diet.p - dailyEntry.p).toFixed(1);
    caloriesValue = (dailyEntry.diet.e - dailyEntry.e).toFixed(1);
    waterValue = waterSettings.g - dailyEntry.w;
  } else if (hudModel === 'additive') {
    fatsValue = dailyEntry.f;
    carbsValue = carbSettings === 'n' ? dailyEntry.k : dailyEntry.diet.c;
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

  // Render

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
  entry: selectEntry,
  carbSettings: selectCarbSettings,
  waterSettings: selectWaterSettings,
});

const mapDispatchToProps = (dispatch) => ({
  setHudModel: (model) => dispatch(setHudModel(model)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DailyChart);
