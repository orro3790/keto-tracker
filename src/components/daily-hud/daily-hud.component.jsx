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
  const [values, setValues] = useState({
    consumed: {
      f: 0,
      c: 0,
      d: 0,
      k: 0,
      p: 0,
      e: 0,
      w: 0,
    },
    goals: {
      f: 0,
      c: 0,
      d: 0,
      k: 0,
      p: 0,
      e: 0,
      w: 0,
    },
    sum: {
      f: 0,
      c: 0,
      d: 0,
      k: 0,
      p: 0,
      e: 0,
      w: 0,
    },
  });

  const UNITS = {
    c: 'cups',
    m: 'mL',
    o: 'oz',
  };

  // if waterUnit is 'cups' ==> handle singular form of 'cups' hud display
  if (waterSettings.u === 'c') {
    if (values.consumed.w === 1) {
      UNITS.c = 'cup';
    }
  }

  const toggleRemaining = () => {
    setHudModel('r');
  };

  const toggleAdditive = () => {
    setHudModel('a');
  };

  const getStyle = (className) => {
    if (className === hudModel) {
      return 'on';
    } else {
      return 'off';
    }
  };

  useEffect(() => {
    if (entry !== '') {
      const goals = ['f', 'c', 'd', 'k', 'p', 'e', 'w'];

      let values = {
        consumed: {
          f: entry.m.f,
          c: entry.m.c,
          d: entry.m.d,
          k: entry.m.k,
          p: entry.m.p,
          e: entry.m.e,
          w: entry.w.t,
        },
        goals: {
          f: entry.g.d.s.f,
          c: entry.g.d.s.c,
          d: entry.g.d.s.d,
          k: entry.g.d.s.k,
          p: entry.g.d.s.p,
          e: entry.g.d.s.e,
          w: entry.g.w.s.w,
        },
        sum: {
          f: 0,
          c: 0,
          d: 0,
          k: 0,
          p: 0,
          e: 0,
          w: 0,
        },
      };
      switch (hudModel) {
        case 'r':
          goals.forEach((goal) => {
            if (values.goals[goal] !== null) {
              values.sum[goal] = values.goals[goal] - values.consumed[goal];
            }
          });
          break;
        case 'a':
          goals.forEach((goal) => {
            if (values.goals[goal] !== null) {
              values.sum[goal] = values.consumed[goal];
            }
          });
          break;
        default:
          break;
      }

      // if water tracking is enabled ==> adjust display of water intake based on user's unit preference
      if (waterSettings.e) {
        switch (waterSettings.u) {
          case 'c':
            values.sum.w = (values.sum.w / 250).toFixed(2);
            break;
          case 'o':
            values.sum.w = (values.sum.w / 29.5735).toFixed(2);
            break;
          case 'm':
            values.sum.w = values.sum.w.toFixed(0);
            break;
          default:
            break;
        }
      }

      setValues(values);
    }
  }, [entry, hudModel, waterSettings]);

  // conditionally render carbs, net carbs, and water columns depending on user settings
  let water, carbs;

  if (carbSettings === 'n') {
    carbs = (
      <div className='carbs macro-c'>
        {values.sum.k}g<div className='l'>net carbs</div>
      </div>
    );
  } else {
    carbs = (
      <div className='carbs macro-c'>
        {values.sum.c}g<div className='l'>carbs</div>
      </div>
    );
  }

  if (waterSettings.e === true) {
    water = (
      <div className='water-c'>
        <div>
          {values.sum.w} {UNITS[waterSettings.u]}
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
        <div className={`${getStyle('r')} remaining`}>
          <div></div>
          <div className='btn' onClick={toggleRemaining}>
            REMAINING
          </div>
        </div>
        <div className='separator'></div>
        <div className={`${getStyle('a')} additive`}>
          <div className='btn' onClick={toggleAdditive}>
            DAILY SUM
          </div>
          <div></div>
        </div>
      </div>
      <div className='daily-hud'>
        {water}
        <div className='fats macro-c'>
          {values.sum.f}g<div className='l'>fats</div>
        </div>
        {carbs}
        <div className='protein macro-c'>
          {values.sum.p}g<div className='l'>protein</div>
        </div>
        <div className=' macro-c'>
          {values.sum.e}
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
