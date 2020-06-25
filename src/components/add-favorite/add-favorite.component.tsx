import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../redux/root-reducer';
import { createStructuredSelector } from 'reselect';
import { selectFoodReference } from '../../redux/search-item/search-item.selectors';
import {
  selectCurrentUserId,
  selectFavFoods,
} from '../../redux/user/user.selectors';
import { Food } from '../../redux/search-item/search-item.types';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import * as AlertModalTypes from '../../redux/alert-modal/alert-modal.types';
import './add-favorite.styles.scss';
import { toggleFavFood } from '../../firebase/firebase.utils';
import { MdBookmark } from 'react-icons/md';

type Props = PropsFromRedux;

const AddFavorite = ({
  foodReference,
  favFoods,
  toggleAlertModal,
  userId,
}: Props) => {
  const [enabled, setEnabled] = useState(false);

  const handleToggleFavFood = () => {
    switch (enabled) {
      case false:
        toggleAlertModal({
          title: 'SUCCESS!',
          msg: `${(foodReference as Food).n} has been added to your favorites.`,
          img: '',
          status: 'visible',
          callback: '',
          sticky: false,
        });
        break;
      case true:
        toggleAlertModal({
          title: 'SUCCESS!',
          msg: `${
            (foodReference as Food).n
          } has been removed from your favorites.`,
          img: '',
          status: 'visible',
          callback: '',
          sticky: false,
        });
        break;
      default:
        break;
    }
    toggleFavFood(userId, foodReference);
  };

  let favStyling;

  if (enabled === true) {
    favStyling = 'fas fa-bookmark on';
  } else {
    favStyling = 'fas fa-bookmark';
  }

  useEffect(() => {
    if (favFoods.some((food: Food) => food.id === (foodReference as Food).id)) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [favFoods, foodReference, toggleAlertModal]);

  return (
    <div>
      <div>
        <MdBookmark className={favStyling} onClick={handleToggleFavFood} />
      </div>
    </div>
  );
};

interface Selectors {
  userId: string | undefined;
  foodReference: Food | '';
  favFoods: [];
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  userId: selectCurrentUserId,
  foodReference: selectFoodReference,
  favFoods: selectFavFoods,
});

const mapDispatchToProps = (
  dispatch: Dispatch<AlertModalTypes.ToggleAlertModal>
) => ({
  toggleAlertModal: (status: AlertModalTypes.Modal) =>
    dispatch(toggleAlertModal(status)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AddFavorite);
