import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import FoodItem from '../food-item/food-item.component';
import { toggleSearchModal } from '../../redux/search-modal/search-modal.actions';
import { createFoodReference } from '../../redux/search-item/search-item.actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectEntry } from '../../redux/date-selector/date-selector.selectors';
import ToggleSearchModal from '../toggle-search/toggle-search.component';
import './meal.styles.scss';
import { RootState } from '../../redux/root-reducer';
import { User } from '../../redux/user/user.types';

import * as TDateSelector from '../../redux/date-selector/date-selector.types';
import * as TSearchModal from '../../redux/search-modal/search-modal.types';
import * as TSearchItem from '../../redux/search-item/search-item.types';

type PropsFromParent = {
  meal: TSearchModal.MealNames;
};
type Props = PropsFromRedux & PropsFromParent;

const Meal = ({ meal, entry, currentUser }: Props) => {
  const [totalFats, setTotalFats] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalNetCarbs, setTotalNetCarbs] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);

  // Mapper from key to human-readable string
  const MEALS = {
    b: 'Breakfast',
    l: 'Lunch',
    d: 'Dinner',
    s: 'Snacks',
  };

  // handles the displaying of totals in the UI, but searchModal handles the calculations
  useEffect(() => {
    if (entry !== '') {
      setTotalFats(entry[meal].t.f);
      setTotalCarbs(entry[meal].t.c);
      setTotalNetCarbs(entry[meal].t.k);
      setTotalProtein(entry[meal].t.p);
      setTotalCalories(entry[meal].t.e);
    }
  }, [entry, meal]);

  // indexing starts at 0, therefore tart from -1 so the first item is assigned a index of 0
  let keygen = -1;

  const renderFoodItems = (food: TSearchItem.Food) => {
    keygen++;
    return <FoodItem key={keygen} index={keygen} food={food} meal={meal} />;
  };

  // initial state of entry is '', need to handle when an entry has not loaded into state yet
  let entryPlaceholder = {
    [meal]: {
      f: [],
    },
  };

  // if an entry object exists in state, assign it to entryPlaceholder so renderFoodItems can map over it
  if (entry !== '') {
    entryPlaceholder = entry;
  }

  let carbType = 'carbs';
  let totalCarbsOrNetCarbsValue;

  if (currentUser?.c === 'n') {
    carbType = 'net carbs';
    totalCarbsOrNetCarbsValue = totalNetCarbs;
  } else {
    carbType = 'carbs';
    totalCarbsOrNetCarbsValue = totalCarbs;
  }

  return (
    <div>
      <div className='meal-h-c'>
        <span className='t'>{MEALS[meal]}</span>
        <span>
          <ToggleSearchModal meal={meal} />
        </span>
      </div>
      {entryPlaceholder[meal].f.map((food: TSearchItem.Food) =>
        renderFoodItems(food)
      )}
      <div className='totals-r'>
        <div className='total-l'>totals</div>
        <div className='totals-c'>
          <div className='size c'></div>
          <div className='fats c'>
            {totalFats}g<div className='macro-l'>fats</div>
          </div>
          <div className='carbs c'>
            {totalCarbsOrNetCarbsValue}g
            <div className='macro-l'>{carbType}</div>
          </div>
          <div className='protein c'>
            {totalProtein}g<div className='macro-l'>protein</div>
          </div>
          <div className='calories c'>
            {totalCalories}
            <div className='macro-l'>calories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Selectors {
  entry: TDateSelector.Entry | '';
  currentUser: User | null;
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  entry: selectEntry,
  currentUser: selectCurrentUser,
});

type Actions = TSearchModal.ToggleSearchModal | TSearchItem.CreateFoodReference;

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  toggleSearchModal: (status: TSearchModal.Modal) =>
    dispatch(toggleSearchModal(status)),
  createFoodReference: (food: TSearchItem.Food) =>
    dispatch(createFoodReference(food)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Meal);
