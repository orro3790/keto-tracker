import React from 'react';
import { connect } from 'react-redux';
import { toggleViewFavsModal } from '../../redux/view-favs/view-favs.actions';
import { createStructuredSelector } from 'reselect';
import { selectFavFoods } from '../../redux/user/user.selectors';
import './view-favs-styles.scss';

const ViewFavs = ({ favFoods, toggleViewFavsModal }) => {
  const handleClose = () => {
    toggleViewFavsModal({
      status: 'hidden',
    });
  };

  console.log(favFoods);
  return (
    <div className='view-favs-m'>
      <div className='create-m-c'>
        <div className='btn-c'>
          <div className='close-create-btn' onClick={handleClose}>
            <i className='fas fa-times'></i>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  // createdFoods is only used here to check the state after adding an item. It's not really necessary
  favFoods: selectFavFoods,
});

const mapDispatchToProps = (dispatch) => ({
  toggleViewFavsModal: (status) => dispatch(toggleViewFavsModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewFavs);
