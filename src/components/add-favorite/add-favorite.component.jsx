import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectFoodReference } from '../../redux/search-item/search-item.selectors';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import './add-favorite.styles.scss';

const AddFavorite = ({ currentUser, foodReference, onClick }) => {
  const [enabled, setEnabled] = useState(false);

  let favStyling;

  if (enabled === true) {
    favStyling = 'fas fa-bookmark on';
  } else {
    favStyling = 'fas fa-bookmark';
  }

  useEffect(() => {
    if (currentUser !== null) {
      if (currentUser.favFoods.some((food) => food.id === foodReference.id)) {
        setEnabled(true);
      } else {
        setEnabled(false);
      }
    }
  }, [currentUser, foodReference]);

  return (
    <div>
      <i className={favStyling} onClick={onClick}></i>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  foodReference: selectFoodReference,
});

const mapDispatchToProps = (dispatch) => ({
  //add a confirmation modal
});

export default connect(mapStateToProps, mapDispatchToProps)(AddFavorite);
