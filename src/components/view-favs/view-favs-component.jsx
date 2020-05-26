import React from 'react';
import FavItem from '../fav-item/fav-item.component';
import { connect } from 'react-redux';
import { toggleViewFavsModal } from '../../redux/view-favs/view-favs.actions';
import { createStructuredSelector } from 'reselect';
import { selectFavFoods } from '../../redux/user/user.selectors';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import './view-favs-styles.scss';

const ViewFavs = ({ favFoods, toggleViewFavsModal }) => {
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

  return (
    <div className='view-favs-m'>
      <div className='view-favs-c'>
        <div className='search-s'>
          <div className='btn-c'>
            <div className='close-create-btn' onClick={handleClose}>
              <i className='fas fa-times'></i>
            </div>
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
