import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../redux/root-reducer';
import { toggleSearchModal } from '../../redux/search-modal/search-modal.actions';
import { createFoodReference } from '../../redux/search-item/search-item.actions';
import { createStructuredSelector } from 'reselect';
import { selectCarbSettings } from '../../redux/user/user.selectors';
import { selectFoodReference } from '../../redux/search-item/search-item.selectors';
import { selectModal } from '../../redux/search-modal/search-modal.selectors';
import './food-item.styles.scss';
import { Food } from '../../redux/search-item/search-item.types';
import { CarbSettings } from '../../redux/user/user.types';
import * as TSearchItem from '../../redux/search-item/search-item.types';
import * as TSearchModal from '../../redux/search-modal/search-modal.types';

type Props = PropsFromRedux & PropsFromParent;

type PropsFromParent = {
  food: Food;
  index: number;
  meal: TSearchModal.MealNames;
};

const FoodItem = ({
  food,
  toggleSearchModal,
  searchModal,
  index,
  meal,
  createFoodReference,
  carbSettings,
}: Props) => {
  const handleClick = () => {
    // If the user is clicking on a food item in the UI, prompt edit mode
    if (searchModal.status === 'hidden') {
      toggleSearchModal({
        status: 'visible',
        meal: meal,
        editMode: {
          enabled: true,
          food: food,
          index: index,
        },
      });
    }
    // If the modal was already open and the user clicks a food item, close the modal, so it acts like a toggle
    else {
      toggleSearchModal({
        status: 'hidden',
        meal: '',
        editMode: {
          enabled: false,
          food: '',
          index: '',
        },
      });
    }
    createFoodReference(food);
  };

  let carbValue = 0;

  if (carbSettings === 'n') {
    carbValue = food.k;
  } else {
    carbValue = food.c;
  }

  return (
    <div className='food-c' onClick={handleClick}>
      <div className='macro-r'>
        <div className='name-desc-c'>
          <div className='name'>{food.n}</div>
          <div className='desc'>{food.b}</div>
        </div>
        <div className='macro-c'>
          <div className='size total-c'>
            {food.size}
            {food.u}
          </div>
          <div className='fats total-c'>{food.f}</div>
          <div className='carbs total-c'>{carbValue}</div>
          <div className='protein total-c'>{food.p}</div>
          <div className='calories total-c'>{food.e}</div>
        </div>
      </div>
    </div>
  );
};

interface Selectors {
  searchModal: TSearchModal.Modal;
  foodReference: Food | '';
  carbSettings: CarbSettings | undefined;
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  searchModal: selectModal,
  foodReference: selectFoodReference,
  carbSettings: selectCarbSettings,
});

type Actions = TSearchModal.ToggleSearchModal | TSearchItem.CreateFoodReference;

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  toggleSearchModal: (status: TSearchModal.Modal) =>
    dispatch(toggleSearchModal(status)),
  createFoodReference: (food: Food | '') => dispatch(createFoodReference(food)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(FoodItem);
