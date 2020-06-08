import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectFoodReference } from '../../redux/search-item/search-item.selectors';
import {
  selectCurrentUserId,
  selectFavFoods,
} from '../../redux/user/user.selectors';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import './add-favorite.styles.scss';
import { toggleFavFood } from '../../firebase/firebase.utils';
import { MdBookmark } from 'react-icons/md';

const AddFavorite = ({ foodReference, favFoods, toggleAlertModal, userId }) => {
  const [enabled, setEnabled] = useState(false);

  const handleToggleFavFood = () => {
    switch (enabled) {
      case false:
        toggleAlertModal({
          title: 'SUCCESS!',
          msg: `${foodReference.n} has been added to your favorites.`,
          img: '',
          status: 'visible',
          callback: '',
          sticky: false,
        });
        break;
      case true:
        toggleAlertModal({
          title: 'SUCCESS!',
          msg: `${foodReference.n} has been removed from your favorites.`,
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
    if (favFoods.some((food) => food.id === foodReference.id)) {
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

const mapStateToProps = createStructuredSelector({
  userId: selectCurrentUserId,
  foodReference: selectFoodReference,
  favFoods: selectFavFoods,
});

const mapDispatchToProps = (dispatch) => ({
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddFavorite);
