import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import FormInput from '../form-input/form-input.component';
import SearchItemSuggestion from './../search-item/search-item.component';
import { firestore } from '../../firebase/firebase.utils';
import { createStructuredSelector } from 'reselect';
import {
  selectCurrentUserId,
  selectFavFoods,
} from '../../redux/user/user.selectors';
import {
  selectFoodReference,
  selectSuggestionWindow,
} from '../../redux/search-item/search-item.selectors';
import {
  selectModal,
  selectFoodFilter,
} from '../../redux/search-modal/search-modal.selectors';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { toggleSuggestionWindow } from '../../redux/search-item/search-item.actions';
import './search.styles.scss';

const Search = ({
  suggestionWindow,
  searchModal,
  foodReference,
  foodFilter,
  userId,
  favFoods,
  toggleSuggestionWindow,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(searchInput);
    setSubmitting(true);
  };

  // when a user changes filters, clear the input field and results
  useEffect(() => {
    setResults('');
    setSearchInput('');
  }, [foodFilter]);

  useEffect(() => {
    // check that query !== '' to prevent a fetch upon mount
    if (query !== '' && submitting === true) {
      const fetchData = async () => {
        if (foodFilter.filter === 'fav') {
          const response = favFoods.filter(
            (food) => food.n === query.toUpperCase()
          );
          console.log(response);
          setResults(response);
        } else {
          const response = await firestore
            .collection(foodFilter.path)
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
      toggleSuggestionWindow(true);
      setSubmitting(false);
    }
    // return () => {
    //   cleanup;
    // };
  }, [
    submitting,
    query,
    foodFilter,
    userId,
    favFoods,
    searchModal.foodFilter,
    toggleSuggestionWindow,
  ]);

  let labelMsg;

  if (searchModal.editMode.enabled === true) {
    labelMsg = `Replace "${foodReference.n}" with ...`;
  } else {
    switch (foodFilter.filter) {
      case 'usda':
        labelMsg = (
          <div>
            Search
            <span className='emphasis'>USDA database </span>
            ...
          </div>
        );
        break;
      case 'fav':
        labelMsg = (
          <div>
            Search
            <span className='emphasis'>favorites </span>
            ...
          </div>
        );
        break;
      case 'custom-foods':
        labelMsg = (
          <div>
            Search
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

  const Row = ({ index, style }) => (
    <div style={style}>
      <SearchItemSuggestion
        key={results[index].i}
        food={results[index]}
        index={index}
      />
    </div>
  );

  if (suggestionWindow === true) {
    rendered = (
      <div className='wrap'>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemCount={results.length}
              itemSize={50}
              width={width}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </div>
    );
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <FormInput
            id='name'
            name='search-in'
            type='text'
            onChange={handleChange}
            value={searchInput}
            label={labelMsg}
            required
          />
        </form>
      </div>
      {rendered}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  suggestionWindow: selectSuggestionWindow,
  searchModal: selectModal,
  foodReference: selectFoodReference,
  userId: selectCurrentUserId,
  favFoods: selectFavFoods,
  foodFilter: selectFoodFilter,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSuggestionWindow: (status) => dispatch(toggleSuggestionWindow(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
