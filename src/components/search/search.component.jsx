import React, { useState, useEffect } from 'react';
import FormInput from '../form-input/form-input.component';
import SearchItemSuggestion from './../search-item-suggestion/search-item-suggestion.component';
import { ToggleSuggestionWindow } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import './search.styles.scss';
import { connect } from 'react-redux';

const Search = ({ foodDatabase, ToggleSuggestionWindow, suggestionWindow }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleChange = async (e) => {
    setSearchInput(e.target.value);
    ToggleSuggestionWindow('visible');
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

  useEffect(() => {
    setSearchInput('');
    return () => {
      //pass
    };
  }, [suggestionWindow]);

  return (
    <div>
      <div className='food-item-input'>
        <form id='name'>
          <FormInput
            id='name'
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
  ToggleSuggestionWindow: (status) => dispatch(ToggleSuggestionWindow(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
