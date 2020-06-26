import React, { useState, useEffect } from 'react';
import EditItem from '../edit-item/edit-item.component';
import FormInput from '../form-input/form-input.component';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { toggleCustomFoodsModal } from '../../redux/custom-foods-modal/custom-foods-modal.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectCurrentUserId,
  selectCustomFoods,
} from '../../redux/user/user.selectors';
import * as TSearchItem from '../../redux/search-item/search-item.types';
import * as TSearchModal from '../../redux/search-modal/search-modal.types';
import * as TCustomFoodsModal from '../../redux/custom-foods-modal/custom-foods-modal.types';
import { selectMeal } from '../../redux/search-modal/search-modal.selectors';
import { toggleSearchModal } from '../../redux/search-modal/search-modal.actions';
import { createFoodReference } from '../../redux/search-item/search-item.actions';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { ReactComponent as Logo } from '../../assets/no-results.svg';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { firestore } from '../../firebase/firebase.utils';
import { RootState } from '../../redux/root-reducer';
import './custom-foods-modal.styles.scss';

type Props = PropsFromRedux;

const CustomFoodsModal = ({
  customFoods,
  toggleCustomFoodsModal,
  userId,
  toggleSearchModal,
  meal,
  createFoodReference,
}: Props) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleBack = () => {
    toggleCustomFoodsModal({
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

  const handleClose = () => {
    toggleCustomFoodsModal({
      status: 'hidden',
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

        const customFoodsArray: object[] = [];

        response.docs.forEach((snapshot) => {
          const snap = snapshot.data();
          snap.id = snapshot.id;
          customFoodsArray.push(snap);
        });

        setResults(customFoodsArray);
      };

      fetchData();
      setSubmitting(false);
    }
    // return () => {
    //   cleanup;
    // };
  }, [query, userId, submitting]);

  let row = ({ index, style }: any) => (
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

interface Selectors {
  customFoods: [];
  userId: string | undefined;
  meal: 'b' | 'l' | 'd' | 's' | '';
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  customFoods: selectCustomFoods,
  userId: selectCurrentUserId,
  meal: selectMeal,
});

type Actions =
  | TSearchModal.ToggleSearchModal
  | TSearchItem.CreateFoodReference
  | TCustomFoodsModal.ToggleCustomFoodsModal;

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  toggleCustomFoodsModal: (object: TCustomFoodsModal.Modal) =>
    dispatch(toggleCustomFoodsModal(object)),
  toggleSearchModal: (object: TSearchModal.Modal) =>
    dispatch(toggleSearchModal(object)),
  createFoodReference: (food: TSearchItem.Food | '') =>
    dispatch(createFoodReference(food)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CustomFoodsModal);
