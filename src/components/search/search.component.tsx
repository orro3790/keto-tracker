import React, { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import FormInput from '../form-input/form-input.component';
import SearchItemSuggestion from '../search-item/search-item.component';
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
import { RootState } from '../../redux/root-reducer';
import * as TSearchModal from '../../redux/search-modal/search-modal.types';
import * as TSearchItem from '../../redux/search-item/search-item.types';

type Props = PropsFromRedux;

const Search = ({
  suggestionWindow,
  searchModal,
  foodReference,
  foodFilter,
  userId,
  favFoods,
  toggleSuggestionWindow,
}: Props) => {
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<'' | TSearchItem.Food[]>('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput);
    // submitting can be used to make sure that a fetch occurs only when a user explicitely submits the form. This way, the useEffect below won't cause unecessary get requests
    setSubmitting(true);
  };

  useEffect(() => {
    // check that query !== '' to prevent a fetch upon mount
    if (query !== '' && submitting === true) {
      const fetchData = async () => {
        if (foodFilter.filter === 'fav') {
          const response = favFoods.filter(
            (food: TSearchItem.Food) => food.n === query.toUpperCase()
          );
          setResults(response);
        } else {
          const response = await firestore
            .collection(foodFilter.path)
            .where('n', '==', query.toUpperCase())
            .get();

          let responses: any = [];

          response.docs.forEach((snapshot) => {
            const snap = snapshot.data();
            snap.id = snapshot.id;
            responses.push(snap);
          });

          setResults(responses);
        }
      };
      fetchData();
      toggleSuggestionWindow({ status: 'visible' });
      setSubmitting(false);
    }
    // return () => {
    //   cleanup;
    // };
  }, [submitting, query, foodFilter, userId, favFoods, toggleSuggestionWindow]);

  let labelMsg;

  if (searchModal.editMode.enabled === true) {
    labelMsg = `Replace "${(foodReference as TSearchItem.Food).n}" with ...`;
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

  type RowProps = {
    index: number;
    style: React.CSSProperties | undefined;
  };

  const row = ({ index, style }: RowProps) => (
    <div style={style}>
      <SearchItemSuggestion
        key={(results[index] as TSearchItem.Food).i}
        food={results[index] as TSearchItem.Food}
        index={index}
      />
    </div>
  );

  if (suggestionWindow === 'visible') {
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
              {row}
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

interface Selectors {
  suggestionWindow: 'hidden' | 'visible';
  searchModal: TSearchModal.Modal;
  foodReference: TSearchItem.Food | '';
  userId: string | undefined;
  favFoods: TSearchItem.Food[];
  foodFilter: TSearchModal.FoodFilter;
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  suggestionWindow: selectSuggestionWindow,
  searchModal: selectModal,
  foodReference: selectFoodReference,
  userId: selectCurrentUserId,
  favFoods: selectFavFoods,
  foodFilter: selectFoodFilter,
});

const mapDispatchToProps = (
  dispatch: Dispatch<TSearchItem.ToggleSuggestionWindow>
) => ({
  toggleSuggestionWindow: (status: TSearchItem.Visibility) =>
    dispatch(toggleSuggestionWindow(status)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Search);
