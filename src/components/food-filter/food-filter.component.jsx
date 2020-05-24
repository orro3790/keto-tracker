import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectFoodFilter } from '../../redux/search-food-modal/search-food-modal.selectors';
import { selectCurrentUserId } from '../../redux/user/user.selectors';
import { setFoodFilter } from './../../redux/search-food-modal/search-food-modal.actions';
import './food-filter.styles.scss';

const FoodFilter = ({ foodFilter, setFoodFilter, userId }) => {
  let userOn, favOn, usdaOn;

  switch (foodFilter.filter) {
    case 'usda':
      usdaOn = 'on';
      break;
    case 'fav':
      favOn = 'on';
      break;
    case 'user-foods':
      userOn = 'on';
      break;
    default:
      break;
  }

  // dispatch food filter to state so it will remember last preference upon reopening of search modal
  const toggleFilter = (e) => {
    if (e.target.className.includes('fav')) {
      setFoodFilter({
        filter: 'fav',
        path: `users/${userId}/favFoods/`,
      });
    } else if (e.target.className.includes('usda')) {
      setFoodFilter({
        filter: 'usda',
        path: `usda`,
      });
    } else if (e.target.className.includes('user-foods')) {
      setFoodFilter({
        filter: 'user-foods',
        path: `users/${userId}/createdFoods/`,
      });
    }
  };

  return (
    <div className='filter-c'>
      <span className='filter-btn'>
        <i
          className={`fas fa-user-tag user-foods ${userOn}`}
          onClick={toggleFilter}
        ></i>
      </span>
      <span className='filter-btn'>
        <i
          className={`fas fa-bookmark fav ${favOn}`}
          onClick={toggleFilter}
        ></i>
      </span>
      <span className='filter-btn'>
        <i
          className={`fas fa-shield-alt usda ${usdaOn}`}
          onClick={toggleFilter}
        ></i>
      </span>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  foodFilter: selectFoodFilter,
  userId: selectCurrentUserId,
});

const mapDispatchToProps = (dispatch) => ({
  setFoodFilter: (filter) => dispatch(setFoodFilter(filter)),
  //add a confirmation modal
});

export default connect(mapStateToProps, mapDispatchToProps)(FoodFilter);
