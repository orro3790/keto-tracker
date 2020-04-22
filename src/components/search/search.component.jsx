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
    ToggleSuggestionWindow('ready to be viewed');
  };

  // even if the suggestionWindow state is 'ready to be viewed', only show if the searchInput !== ''
  const displaySuggestionWindow = (food) => {
    if (food.name.includes(searchInput) && searchInput !== '') {
      return <SearchItemSuggestion key={food.id} food={food} />;
    }
  };

  useEffect(() => {
    // when suggestionWindow changes state, set search input field back to ''. By default, suggestionWindow will be 'ready to be viewed', so when a user first types in the field, there will be no change. Pressing the + button will change the state to 'hidden', causing useEffect to set the searchInput to '' again (clearing the input and causing the suggestion window to hide), and the addFoodToDiaryModal to popup. Closing or submitting the modal will toggle suggestionWindow back to 'ready to be viewed', and useEffect will kick in again and set searchInput back to ''.
    setSearchInput('');
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
        <div className='search-results-list'>
          {foodDatabase.map((food) => displaySuggestionWindow(food))}
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
