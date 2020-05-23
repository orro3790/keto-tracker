import React, { useState, useEffect } from 'react';
import FormInput from '../form-input/form-input.component';
import SearchItemSuggestion from './../search-item-suggestion/search-item-suggestion.component';
import './search.styles.scss';
import { connect } from 'react-redux';
import { firestore } from '../../firebase/firebase.utils';

const Search = ({
  suggestionWindow,
  searchModal,
  foodReference,
  filter,
  foodFilter,
  currentUser,
}) => {
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

  useEffect(() => {
    // when suggestionWindow changes state --> clear searchInput --> hides window. Pressing the + btn in suggestion window changes suggestionWindow and triggers the reset. Submitting or closing the modal popup triggers the reset as well.
    setSearchInput('');
  }, [suggestionWindow]);

  useEffect(() => {
    const fetchData = async () => {
      if (foodFilter === 'fav') {
        const response = currentUser.favFoods.filter(
          (food) => food.n === query.toUpperCase()
        );
        setResults(response);
      } else {
        const response = await firestore
          .collection(filter)
          .where('n', '==', query.toUpperCase())
          .get();

        setResults(
          response.docs.map((snapshot) => {
            const snap = snapshot.data();
            snap.id = snapshot.id;
            return snap;
          })
        );
      }
    };

    fetchData();

    // return () => {
    //   cleanup;
    // };
  }, [query, filter, foodFilter, currentUser]);

  let labelMsg;

  if (searchModal.editMode === true) {
    labelMsg = `Replace "${foodReference.n}" with ...`;
  } else {
    switch (foodFilter) {
      case 'usda':
        labelMsg = (
          <div>
            Search foods within
            <span className='emphasis'>USDA database </span>
            ...
          </div>
        );
        break;
      case 'fav':
        labelMsg = (
          <div>
            Search foods within
            <span className='emphasis'>my favorites </span>
            ...
          </div>
        );
        break;
      case 'user-foods':
        labelMsg = (
          <div>
            Search foods within
            <span className='emphasis'>my custom foods </span>
            ...
          </div>
        );
        break;
      default:
        break;
    }
  }

  let rendered;

  if (searchInput !== '') {
    rendered = results.map((food) => (
      <SearchItemSuggestion key={food.i} food={food} />
    ));
  } else {
    rendered = null;
  }

  return (
    <div>
      <div className='food-item-in'>
        <form onSubmit={handleSubmit}>
          <FormInput
            id='name'
            name='search-in'
            inputType='input'
            type='text'
            onChange={handleChange}
            value={searchInput}
            label={labelMsg}
            required
          />
        </form>
      </div>
      <div className='wrap'>
        <div className='result-li'>{rendered}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  suggestionWindow: state.searchItemSuggestion.suggestionWindow,
  searchModal: state.searchModal.searchModal,
  foodReference: state.searchItemSuggestion.foodReference,
  foodFilter: state.searchModal.foodFilter,
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Search);
