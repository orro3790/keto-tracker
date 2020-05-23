import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
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

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  foodReference: state.searchItemSuggestion.foodReference,
});

const mapDispatchToProps = (dispatch) => ({
  //add a confirmation modal
});

export default connect(mapStateToProps, mapDispatchToProps)(AddFavorite);
