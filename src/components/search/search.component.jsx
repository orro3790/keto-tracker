import React, { useState, useEffect } from 'react';
import FormInput from '../form-input/form-input.component';
import SearchItemSuggestion from './../search-item-suggestion/search-item-suggestion.component';
import './search.styles.scss';
import { connect } from 'react-redux';
import { firestore } from '../../firebase/firebase.utils';

const Search = ({ suggestionWindow, searchModal, foodReference }) => {
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(searchInput);
  };

  // even if the suggestionWindow state is 'ready to be viewed', only show if the searchInput !== ''
  // const displaySuggestionWindow = (food) => {
  //   if (food.name.includes(searchInput.toLowerCase()) && searchInput !== '') {
  //     return <SearchItemSuggestion key={food.id} food={food} />;
  //   }
  // };

  useEffect(() => {
    // when suggestionWindow changes state --> clear searchInput --> hides window. Pressing the + btn in suggestion window changes suggestionWindow and triggers the reset. Submitting or closing the modal popup triggers the reset as well.
    setSearchInput('');
  }, [suggestionWindow]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await firestore
        .collection('usda')
        .where('description', '==', query)
        .get();

      // update state with results, snapshot.data() doesn't include the doc id, so add it to the json obj to use as a key
      setResults(
        response.docs.map((snapshot) => {
          const snap = snapshot.data();
          snap.id = snapshot.id;
          return snap;
        })
      );
    };

    fetchData();

    // return () => {
    //   cleanup;
    // };
  }, [query]);

  let labelMsg;

  if (searchModal.editMode === true) {
    labelMsg = `replace ${foodReference.name} with ...`;
  } else {
    labelMsg = `Click to add an entry to ${searchModal.meal} ...`;
  }

  let rendered;

  if (searchInput !== '') {
    rendered = results.map((food) => (
      <SearchItemSuggestion key={food.id} food={food} />
    ));
  } else {
    rendered = null;
  }

  return (
    <div>
      <div className='food-item-input'>
        <form onSubmit={handleSubmit}>
          <FormInput
            id='name'
            name='search-input'
            type='text'
            onChange={handleChange}
            value={searchInput}
            label={labelMsg}
            required
          />
        </form>
      </div>
      <div className='wrapper'>
        <div className='search-results-list'>{rendered}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  suggestionWindow: state.searchItemSuggestion.suggestionWindow,
  searchModal: state.meal.searchModal,
  foodReference: state.searchItemSuggestion.foodReference,
});

export default connect(mapStateToProps)(Search);
