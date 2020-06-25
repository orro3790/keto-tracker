import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { selectFoodFilter } from '../../redux/search-modal/search-modal.selectors';
import { selectCurrentUserId } from '../../redux/user/user.selectors';
import { setFoodFilter } from '../../redux/search-modal/search-modal.actions';
import { MdVerifiedUser, MdTurnedIn } from 'react-icons/md';
import { FaUserTag } from 'react-icons/fa';
import './food-filter.styles.scss';
import { RootState } from '../../redux/root-reducer';
import * as TSearchModal from '../../redux/search-modal/search-modal.types';

type Props = PropsFromRedux;

const FoodFilter = ({ foodFilter, setFoodFilter, userId }: Props) => {
  let userOn, favOn, usdaOn;

  switch (foodFilter.filter) {
    case 'usda':
      usdaOn = 'on';
      break;
    case 'fav':
      favOn = 'on';
      break;
    case 'custom-foods':
      userOn = 'on';
      break;
    default:
      break;
  }

  // dispatch food filter to state so it will remember last preference upon reopening of search modal
  const toggleFilter = (e: React.MouseEvent<SVGElement>) => {
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
    } else if (e.currentTarget.className.baseVal.includes('custom-foods')) {
      setFoodFilter({
        filter: 'custom-foods',
        path: `users/${userId}/createdFoods/`,
      });
    }
  };

  return (
    <div className='filter-c'>
      <div></div>
      <span className='filter-btn'>
        <FaUserTag
          className={`fas fa-user-tag custom-foods ${userOn}`}
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

interface Selectors {
  foodFilter: TSearchModal.FoodFilter;
  userId: string | undefined;
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  foodFilter: selectFoodFilter,
  userId: selectCurrentUserId,
});

const mapDispatchToProps = (
  dispatch: Dispatch<TSearchModal.SetFoodFilter>
) => ({
  setFoodFilter: (filter: TSearchModal.FoodFilter) =>
    dispatch(setFoodFilter(filter)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(FoodFilter);
