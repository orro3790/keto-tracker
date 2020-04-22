import React, { useState } from 'react';
import FormInput from '../form-input/form-input.component';
import SearchItemSuggestion from './../search-item-suggestion/search-item-suggestion.component';
import { CloseSuggestionWindow } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import './search.styles.scss';
import { connect } from 'react-redux';

const Search = ({ foodDatabase, CloseSuggestionWindow, suggestionWindow }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleChange = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value !== '') {
      CloseSuggestionWindow('visible');
    } else {
      CloseSuggestionWindow('hidden');
    }
  };

  const myFunc = (food) => {
    if (food.name.includes(searchInput) && searchInput !== '') {
      return (
        // <li className='search-result-li' key={food.name}>
        //   {food.name}
        // </li>
        <SearchItemSuggestion key={food.id} food={food} />
      );
    }
  };

  const toggleSearchResults = () => {
    if (suggestionWindow === 'hidden') {
      return 'search-results-list hidden';
    } else if (suggestionWindow === 'visible') {
      return 'search-results-list';
    }
  };

  return (
    <div>
      <div className='food-item-input'>
        <form>
          <FormInput
            name='search-input'
            type='text'
            onChange={handleChange}
            value={searchInput}
            label='Add a food item'
            required
          />
        </form>
      </div>
      <div className='wrapper'>
        <div className={toggleSearchResults()}>
          {foodDatabase.map((food) => myFunc(food))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  foodDatabase: state.foodDiary.foods,
  suggestionWindow: state.searchItemSuggestion.suggestionWindow,
});

const mapDispatchToProps = (dispatch) => ({
  CloseSuggestionWindow: (status) => dispatch(CloseSuggestionWindow(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
