import React, { useState } from 'react';
import FavItem from '../fav-item/fav-item.component';
import FoodFilter from '../food-filter/food-filter.component';
import { connect } from 'react-redux';
import { toggleViewFavsModal } from '../../redux/favs-modal/favs-modal.actions';
import { createStructuredSelector } from 'reselect';
import { selectFavFoods } from '../../redux/user/user.selectors';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import FormInput from '../../components/form-input/form-input.component';
import './favs-modal.styles.scss';

const ViewFavs = ({ favFoods, toggleViewFavsModal }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleClose = () => {
    toggleViewFavsModal({
      status: 'hidden',
    });
  };

  const Row = ({ index, style }) => (
    <div style={style}>
      <FavItem key={favFoods[index].i} food={favFoods[index]} index={index} />
    </div>
  );

  const handleSubmit = () => {
    console.log('submitted');
  };

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div>
      <div className='view-favs-m'>
        <div className='btn-c'>
          <div></div>
          <div className='close-btn' onClick={handleClose}>
            <i className='fas fa-times'></i>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <FormInput
              id='name'
              name='search-in'
              inputType='input'
              type='text'
              onChange={handleChange}
              value={searchInput}
              label='Search favorites list'
              required
            />
          </form>
        </div>
        <div className='favs-list'>
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                itemCount={favFoods.length}
                itemSize={50}
                width={width}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
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
