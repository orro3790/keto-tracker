import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectFoodReference } from '../../redux/search-item/search-item.selectors';
import {
  selectCurrentUser,
  selectFavFoods,
} from '../../redux/user/user.selectors';

import './add-favorite.styles.scss';

const AddFavorite = ({ foodReference, onClick, favFoods }) => {
  const [enabled, setEnabled] = useState(false);

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
  }, [favFoods, foodReference]);

  return (
    <div>
      <i className={favStyling} onClick={onClick}></i>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  foodReference: selectFoodReference,
  favFoods: selectFavFoods,
});

export default connect(mapStateToProps)(AddFavorite);
