import React from 'react';
import './toggle-search.styles.scss';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { selectModal } from '../../redux/search-modal/search-modal.selectors';
import { selectCustomFoodsModalStatus } from '../../redux/custom-foods-modal/custom-foods-modal.selectors';
import { selectCreateFoodModalStatus } from '../../redux/create-food/create-food.selectors';
import { selectFavModalStatus } from '../../redux/favs-modal/favs-modal.selectors';
import { toggleSearchModal } from '../../redux/search-modal/search-modal.actions';
import { toggleCustomFoodsModal } from '../../redux/custom-foods-modal/custom-foods-modal.actions';
import { toggleCreateFoodModal } from '../../redux/create-food/create-food.actions';
import { toggleFavsModal } from '../../redux/favs-modal/favs-modal.actions';
import {
  createFoodReference,
  toggleSuggestionWindow,
} from '../../redux/search-item/search-item.actions';
import { selectSuggestionWindow } from '../../redux/search-item/search-item.selectors';
import { MdAddBox } from 'react-icons/md';
import { RootState } from '../../redux/root-reducer';
import * as TSearchModal from '../../redux/search-modal/search-modal.types';
import * as TSearchItem from '../../redux/search-item/search-item.types';
import * as TCustomFoodsModal from '../../redux/custom-foods-modal/custom-foods-modal.types';
import * as TCreateFoodModal from '../../redux/create-food/create-food.types';
import * as TFavsModal from '../../redux/favs-modal/favs-modal.types';

type PropsFromParent = { meal: 'b' | 'l' | 'd' | 's' | '' };
type Props = PropsFromRedux & PropsFromParent;

const ToggleSearchModal = ({
  meal,
  searchModal,
  createFoodModalStatus,
  customFoodsModalStatus,
  favModalStatus,
  toggleCreateFoodModal,
  toggleCustomFoodsModal,
  toggleSearchModal,
  toggleFavsModal,
  toggleSuggestionWindow,
  createFoodReference,
  suggestionWindow,
}: Props) => {
  const handleClick = () => {
    // reset suggestionWindow and there is no foodReference still in state, then open modal
    if (suggestionWindow === true) {
      toggleSuggestionWindow(false);
    }

    // if any other modals are open, close them
    if (createFoodModalStatus === 'visible') {
      toggleCreateFoodModal({
        status: 'hidden',
      });
    }

    if (customFoodsModalStatus === 'visible') {
      toggleCustomFoodsModal({
        status: 'hidden',
      });
    }

    if (favModalStatus === 'visible') {
      toggleFavsModal({
        status: 'hidden',
      });
    }

    createFoodReference('');

    // only open the search modal if the other modals are hidden, preventing opening it behind other modals
    if (
      searchModal.status === 'hidden' &&
      createFoodModalStatus === 'hidden' &&
      customFoodsModalStatus === 'hidden' &&
      favModalStatus === 'hidden'
    ) {
      toggleSearchModal({
        status: 'visible',
        meal: meal,
        editMode: {
          enabled: false,
          food: '',
          index: '',
        },
      });
    } else {
      toggleSearchModal({
        status: 'hidden',
        meal: '',
        editMode: {
          enabled: false,
          food: '',
          index: '',
        },
      });
    }
  };

  return (
    <div>
      <span className='add-btn' onClick={handleClick}>
        <MdAddBox className='fas fa-plus-square' />
      </span>
    </div>
  );
};

interface Selectors {
  searchModal: TSearchModal.Modal;
  suggestionWindow: boolean;
  customFoodsModalStatus: 'hidden' | 'visible';
  createFoodModalStatus: 'hidden' | 'visible';
  favModalStatus: 'hidden' | 'visible';
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  searchModal: selectModal,
  suggestionWindow: selectSuggestionWindow,
  customFoodsModalStatus: selectCustomFoodsModalStatus,
  createFoodModalStatus: selectCreateFoodModalStatus,
  favModalStatus: selectFavModalStatus,
});

type Actions =
  | TSearchModal.ToggleSearchModal
  | TSearchItem.ToggleSuggestionWindow
  | TCustomFoodsModal.ToggleCustomFoodsModal
  | TFavsModal.ToggleFavsModal
  | TCreateFoodModal.ToggleCreateFoodModal
  | TSearchItem.CreateFoodReference;

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  toggleSearchModal: (status: TSearchModal.Modal) =>
    dispatch(toggleSearchModal(status)),
  toggleSuggestionWindow: (status: boolean) =>
    dispatch(toggleSuggestionWindow(status)),
  toggleCustomFoodsModal: (status: TCustomFoodsModal.Modal) =>
    dispatch(toggleCustomFoodsModal(status)),
  toggleFavsModal: (status: TFavsModal.Modal) =>
    dispatch(toggleFavsModal(status)),
  toggleCreateFoodModal: (status: TCreateFoodModal.Modal) =>
    dispatch(toggleCreateFoodModal(status)),
  createFoodReference: (food: TSearchItem.Food | '') =>
    dispatch(createFoodReference(food)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ToggleSearchModal);
