import React, { useState, useEffect } from 'react';
import EditItem from '../edit-item/edit-item.component';
import { connect } from 'react-redux';
import { toggleCustomFoodsModal } from '../../redux/custom-foods-modal/custom-foods-modal.actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUserId } from '../../redux/user/user.selectors';
import { selectCustomFoods } from '../../redux/user/user.selectors';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import FormInput from '../../components/form-input/form-input.component';
import './custom-foods-modal.styles.scss';
import { ReactComponent as Logo } from '../../assets/no-results.svg';
import { firestore } from '../../firebase/firebase.utils';

const CustomFoodsModal = ({ customFoods, toggleCustomFoodsModal, userId }) => {
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    toggleCustomFoodsModal({
      status: 'hidden',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(searchInput);
    setSubmitting(true);
  };

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    // if backspace to '', no need to fetch data again, load the list from state
    if (searchInput === '') {
      setResults(customFoods);
    }
  }, [searchInput, customFoods]);

  useEffect(() => {
    // check that query !== '' to prevent a fetch upon mount
    if (query !== '' && submitting === true) {
      const fetchData = async () => {
        const response = await firestore
          .collection(`users/${userId}/createdFoods`)
          .where('n', '==', query.toUpperCase())
          .get();

        setResults(
          response.docs.map((snapshot) => {
            const snap = snapshot.data();
            snap.id = snapshot.id;
            return snap;
          })
        );
      };

      fetchData();
      setSubmitting(false);
    }
    // return () => {
    //   cleanup;
    // };
  }, [query, userId, submitting]);

  let Row = ({ index, style }) => (
    <div style={style}>
      <EditItem
        key={results[index].i}
        food={results[index]}
        index={index}
        type='user-foods'
      />
    </div>
  );

  let resultsList = (
    <div className='no-results-t'>
      <div className='logo'>
        <Logo className='logo' />
      </div>
    </div>
  );

  if (results.length > 0) {
    resultsList = (
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
    );
  }

  return (
    <div>
      <div className='view-favs-m'>
        <div className='btn-c'>
          <div></div>
          <div className='close-btn' onClick={handleClose}>
            <i className='fas fa-times'></i>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <FormInput
              id='name'
              name='search-in'
              inputType='input'
              type='text'
              onChange={handleChange}
              value={searchInput}
              label='Search custom foods list'
              required
            />
          </form>
        </div>
        <div className='list-s'>{resultsList}</div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  // createdFoods is only used here to check the state after adding an item. It's not really necessary
  customFoods: selectCustomFoods,
  userId: selectCurrentUserId,
});

const mapDispatchToProps = (dispatch) => ({
  toggleCustomFoodsModal: (status) => dispatch(toggleCustomFoodsModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomFoodsModal);
