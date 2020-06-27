import React, { useState, useEffect } from 'react';
import EditItem from '../edit-item/edit-item.component';
import FormInput from '../form-input/form-input.component';
import AutoSizer from 'react-virtualized-auto-sizer';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { toggleFavsModal } from '../../redux/favs-modal/favs-modal.actions';
import { createFoodReference } from '../../redux/search-item/search-item.actions';

import { createStructuredSelector } from 'reselect';
import {
  selectFavFoods,
  selectCurrentUserId,
} from '../../redux/user/user.selectors';
import { FixedSizeList as List } from 'react-window';
import { firestore } from '../../firebase/firebase.utils';
import { ReactComponent as Logo } from '../../assets/no-results.svg';
import './favs-modal.styles.scss';
import { toggleSearchModal } from '../../redux/search-modal/search-modal.actions';
import { selectMeal } from '../../redux/search-modal/search-modal.selectors';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import * as TSearchModal from '../../redux/search-modal/search-modal.types';
import * as TSearchItem from '../../redux/search-item/search-item.types';
import * as TFavsModal from '../../redux/favs-modal/favs-modal.types';
import { RootState } from '../../redux/root-reducer';
import { Food } from '../../redux/search-item/search-item.types';

type Props = PropsFromRedux;

const FavsModal = ({
  favFoods,
  toggleFavsModal,
  userId,
  meal,
  toggleSearchModal,
  createFoodReference,
}: Props) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>(favFoods);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleClose = () => {
    toggleFavsModal({
      status: 'hidden',
    });
  };

  const handleBack = () => {
    toggleFavsModal({
      status: 'hidden',
    });
    createFoodReference('');
    toggleSearchModal({
      status: 'visible',
      meal: meal,
      editMode: {
        enabled: false,
        food: '',
        index: '',
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput);
    setSubmitting(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    // if backspace to '', no need to fetch data again, load the list from state
    if (searchInput === '') {
      setResults(favFoods);
    }
  }, [searchInput, favFoods]);

  useEffect(() => {
    // check that query !== '' to prevent a fetch upon mount
    if (query !== '' && submitting === true) {
      const fetchData = async () => {
        const response = await firestore
          .collection(`users/${userId}/favFoods`)
          .where('n', '==', query.toUpperCase())
          .get();

        const favs: object[] = [];

        response.docs.forEach((snapshot) => {
          const snap = snapshot.data();
          snap.id = snapshot.id;
          favs.push(snap);
        });

        setResults(favs);
      };

      fetchData();
      setSubmitting(false);
    }
    // return () => {
    //   cleanup;
    // };
  }, [query, userId, submitting]);

  type RowProps = {
    index: number;
    style: React.CSSProperties | undefined;
  };

  let row = ({ index, style }: RowProps) => (
    <div style={style}>
      <EditItem key={results[index].i} food={results[index]} index={index} />
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
            {row}
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
          <div className='back-btn' onClick={handleBack}>
            <FaArrowLeft className='fas fa-arrow-left' />
          </div>
          <div className='close-btn' onClick={handleClose}>
            <FaTimes className='fas fa-times' />
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <FormInput
              id='name'
              name='search-in'
              type='text'
              onChange={handleChange}
              value={searchInput}
              label='Search favorites list'
              required
            />
          </form>
        </div>
        <div className='list-s'>{resultsList}</div>
      </div>
    </div>
  );
};

interface Selectors {
  favFoods: [];
  userId: string | undefined;
  meal: TSearchModal.MealNames | '';
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  // createdFoods is only used here to check the state after adding an item. It's not really necessary
  favFoods: selectFavFoods,
  userId: selectCurrentUserId,
  meal: selectMeal,
});

type Actions =
  | TSearchModal.ToggleSearchModal
  | TSearchItem.CreateFoodReference
  | TFavsModal.ToggleFavsModal;

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  toggleFavsModal: (status: TFavsModal.Modal) =>
    dispatch(toggleFavsModal(status)),
  toggleSearchModal: (status: TSearchModal.Modal) =>
    dispatch(toggleSearchModal(status)),
  createFoodReference: (food: TSearchItem.Food | '') =>
    dispatch(createFoodReference(food)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(FavsModal);
