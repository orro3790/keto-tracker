import React, { useState, useEffect } from 'react';
import FormInput from '../form-input/form-input.component';
import SearchItemSuggestion from './../search-item-suggestion/search-item-suggestion.component';
import { ToggleSuggestionWindow } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import './search.styles.scss';
import { connect } from 'react-redux';

const Search = ({
  foodDatabase,
  ToggleSuggestionWindow,
  suggestionWindow,
  searchModal,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleChange = async (e) => {
    setSearchInput(e.target.value);
  };

  // even if the suggestionWindow state is 'ready to be viewed', only show if the searchInput !== ''
  const displaySuggestionWindow = (food) => {
    if (food.name.includes(searchInput.toLowerCase()) && searchInput !== '') {
      return <SearchItemSuggestion key={food.id} food={food} />;
    }
  };

  useEffect(() => {
    // when suggestionWindow changes state --> clear searchInput --> hides window. Pressing the + btn in suggestion window changes suggestionWindow and triggers the reset. Submitting or closing the modal popup triggers the reset as well.
    setSearchInput('');
  }, [suggestionWindow]);

  return (
    <div>
      <div className='food-item-input'>
        <form>
          <FormInput
            id='name'
            name='search-input'
            type='text'
            onChange={handleChange}
            value={searchInput}
            label={`add an entry to ${searchModal.meal}`}
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
  foodDatabase: state.foodDiary.foodDatabase,
  suggestionWindow: state.searchItemSuggestion.suggestionWindow,
  searchModal: state.meal.searchModal,
});

const mapDispatchToProps = (dispatch) => ({
  ToggleSuggestionWindow: (status) => dispatch(ToggleSuggestionWindow(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
