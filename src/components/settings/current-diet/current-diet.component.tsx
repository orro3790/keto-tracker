import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectDietSettings,
  selectCarbSettings,
} from '../../../redux/user/user.selectors';
import { FaChartPie } from 'react-icons/fa';
import './current-diet.styles.scss';
import { Diet } from '../../../redux/user/user.types';
import { RootState } from '../../../redux/root-reducer';

type Props = PropsFromRedux;

const CurrentDiet = ({ diet, carbSettings }: Props) => {
  let fats, protein, carbs, calories;

  let carbType = 'carbs';

  fats = diet?.f;
  protein = diet?.p;
  calories = diet?.e;
  carbs = diet?.c;

  if (carbSettings === 'n') {
    carbs = diet?.k;
    carbType = 'net carbs';
  }

  return (
    <div>
      <div className='set-h-c'>
        <FaChartPie className='set-i current-i' />
        <div className='t'>Current Diet</div>
      </div>

      <div className='current-diet-c'>
        <div className='fats macro-c'>
          {fats}g<div className='l'>fats</div>
        </div>
        <div className='carbs macro-c'>
          {carbs}g<div className='l'>{carbType}</div>
        </div>
        <div className='protein macro-c'>
          {protein}g<div className='l'>protein</div>
        </div>
        <div className='macro-c'>
          {calories}
          <div className='l'>calories</div>
        </div>
      </div>
    </div>
  );
};

interface Selectors {
  carbSettings: 't' | 'n' | undefined;
  diet: Diet | undefined;
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  carbSettings: selectCarbSettings,
  diet: selectDietSettings,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CurrentDiet);
