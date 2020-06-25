import React from 'react';
import './search-item.styles.scss';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import {
  createFoodReference,
  toggleSuggestionWindow,
} from '../../redux/search-item/search-item.actions';
import { FaPlusSquare } from 'react-icons/fa';
import * as TSearchItem from '../../redux/search-item/search-item.types';
import { selectSuggestionWindow } from '../../redux/search-item/search-item.selectors';

type PropsFromParent = {
  food: TSearchItem.Food;
  index: number;
};

type Props = PropsFromRedux & PropsFromParent;

const SearchItem = ({
  food,
  createFoodReference,
  toggleSuggestionWindow,
  suggestionWindow,
  index,
}: Props) => {
  const handleClick = () => {
    createFoodReference(food);
    toggleSuggestionWindow(!suggestionWindow);
  };

  const truncate = (string: string) => {
    if (string !== '') {
      if (string.length > 50) {
        return `${string.slice(0, 50)}...`;
      } else {
        return `${string}`;
      }
    }
  };

  return (
    <div
      className={`item-c ${index % 2 ? 'liOdd' : 'liEven'}`}
      onClick={handleClick}
    >
      <FaPlusSquare className='fas fa-plus-square add-btn' />

      <span className='name'>{food.n}</span>
      <div></div>
      <div className='desc'>{truncate(food.b)}</div>
    </div>
  );
};

const mapStateToProps = () => ({
  suggestionWindow: selectSuggestionWindow,
});

const mapDispatchToProps = (dispatch: Dispatch<TSearchItem.Actions>) => ({
  createFoodReference: (food: TSearchItem.Food) =>
    dispatch(createFoodReference(food)),
  toggleSuggestionWindow: (status: boolean) =>
    dispatch(toggleSuggestionWindow(status)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SearchItem);
