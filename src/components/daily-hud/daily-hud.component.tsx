import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCarbSettings,
  selectWaterSettings,
} from '../../redux/user/user.selectors';
import { selectEntry } from '../../redux/date-selector/date-selector.selectors';
import { selectHudSettings } from '../../redux/daily-hud/daily-hud.selectors';
import { setHudModel } from '../../redux/daily-hud/daily-hud-actions';
import { GiWaterDrop } from 'react-icons/gi';
import { RootState } from '../../redux/root-reducer';
import * as DailyHudTypes from '../../redux/daily-hud/daily-hud.types';
import * as UserTypes from '../../redux/user/user.types';
import { Entry } from '../../redux/date-selector/date-selector.types';
import './daily-hud.styles.scss';

type Props = PropsFromRedux;

const DailyChart = ({
  setHudModel,
  carbSettings,
  hudModel,
  entry,
  waterSettings,
}: Props) => {
  const [values, setValues] = useState<Mapper>({
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

  interface Mapper {
    [index: string]: any;
    consumed: {
      [index: string]: any;
      f: number;
      c: number | null;
      d: number | null;
      k: number | null;
      p: number;
      e: number;
      w: number | null;
    };
    goals: {
      [index: string]: any;
      f: number;
      c: number | null;
      d: number | null;
      k: number | null;
      p: number;
      e: number;
      w: number | null;
    };
    sum: {
      [index: string]: any;
      f: number;
      c: number | null;
      d: number | null;
      k: number | null;
      p: number;
      e: number;
      w: number | null;
    };
  }

  const UNITS = {
    c: 'cups',
    m: 'mL',
    o: 'oz',
  };

  // if waterUnit is 'cups' ==> handle singular form of 'cups' hud display

  if (waterSettings?.u === 'c') {
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

  const getStyle = (className: DailyHudTypes.HudModel) => {
    if (className === hudModel) {
      return 'on';
    } else {
      return 'off';
    }
  };

  useEffect(() => {
    if (entry !== '') {
      const values: Mapper = {
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
          f: entry.g.s.f,
          c: entry.g.s.c,
          d: entry.g.s.d,
          k: entry.g.s.k,
          p: entry.g.s.p,
          e: entry.g.s.e,
          w: entry.g.s.w,
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
          Object.keys(values.goals).forEach((goal) => {
            if (values.goals[goal] !== null) {
              values.sum[goal] = (
                values.goals[goal] - values.consumed[goal]
              ).toFixed(1);
            }
          });
          break;
        case 'a':
          Object.keys(values.goals).forEach((goal) => {
            if (values.goals[goal] !== null) {
              values.sum[goal] = values.consumed[goal].toFixed(1);
            }
          });
          break;
        default:
          break;
      }

      // if water tracking is enabled ==> adjust display of water intake based on user's unit preference
      if (waterSettings?.e) {
        switch (waterSettings?.u) {
          case 'c':
            values.sum.w = parseFloat(
              ((values.sum.w as number) / 250).toFixed(2)
            );
            break;
          case 'o':
            values.sum.w = parseFloat(
              ((values.sum.w as number) / 29.5735).toFixed(2)
            );
            break;
          case 'm':
            values.sum.w = parseFloat((values.sum.w as number).toFixed(0));
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

  if (waterSettings?.e === true) {
    water = (
      <div className='water-c'>
        <div>
          {values.sum.w} {UNITS[waterSettings?.u]}
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

interface Selectors {
  hudModel: DailyHudTypes.HudModel;
  entry: Entry | '';
  carbSettings: UserTypes.CarbSettings | undefined;
  waterSettings: UserTypes.WaterSettings | undefined;
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  hudModel: selectHudSettings,
  entry: selectEntry,
  carbSettings: selectCarbSettings,
  waterSettings: selectWaterSettings,
});

const mapDispatchToProps = (dispatch: Dispatch<DailyHudTypes.SetHudModel>) => ({
  setHudModel: (model: DailyHudTypes.HudModel) => dispatch(setHudModel(model)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DailyChart);
