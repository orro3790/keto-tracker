import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectFoodFilter } from '../../redux/search-modal/search-modal.selectors';
import { selectCurrentUserId } from '../../redux/user/user.selectors';
import { setFoodFilter } from '../../redux/search-modal/search-modal.actions';
import { MdVerifiedUser, MdTurnedIn } from 'react-icons/md';
import { FaUserTag } from 'react-icons/fa';
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
    if (e.currentTarget.className.baseVal.includes('fav')) {
      setFoodFilter({
        filter: 'fav',
        path: `users/${userId}/favFoods/`,
      });
    } else if (e.currentTarget.className.baseVal.includes('usda')) {
      setFoodFilter({
        filter: 'usda',
        path: `usda`,
      });
    } else if (e.currentTarget.className.baseVal.includes('user-foods')) {
      setFoodFilter({
        filter: 'user-foods',
        path: `users/${userId}/createdFoods/`,
      });
    }
  };

  return (
    <div className='filter-c'>
      <div></div>
      <span className='filter-btn'>
        <FaUserTag
          className={`fas fa-user-tag user-foods ${userOn}`}
          onClick={toggleFilter}
        />
      </span>
      <span className='filter-btn'>
        <MdTurnedIn
          className={`fas fa-bookmark fav ${favOn}`}
          onClick={toggleFilter}
        />
      </span>
      <span className='filter-btn'>
        <MdVerifiedUser
          className={`fas fa-shield-alt usda ${usdaOn}`}
          onClick={toggleFilter}
        />
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
