import { getPensionFake } from '../../utils/getPensionFake';
import { types } from '../types';

const initialState = {
  modal: {
    isOpen: false,
    data: null,
  },
  spinner: { isActive: false },
  sidebar: { isActive: false },
  homeChart: getPensionFake(),
};

export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    // * Modal
    case types.uiModalOpen:
      return { ...state, modal: { ...state.modal, isOpen: true } };

    case types.uiModalClose:
      return { ...state, modal: { ...state.modal, isOpen: false } };

    case types.uiModalLoadDara:
      return { ...state, modal: { ...state.modal, data: action.payload } };

    case types.uiModalUnloadDara:
      return { ...state, modal: { ...state.modal, data: null } };

    // * Sppiner
    case types.uiSpinnerActive:
      return { ...state, spinner: { ...state.spinner, isActive: true } };

    case types.uiSpinnerDesactive:
      return { ...state, spinner: { ...state.spinner, isActive: false } };

    // * Sidebar
    case types.uiSidebarActive:
      return { ...state, sidebar: { ...state.sidebar, isActive: true } };

    case types.uiSidebarDesactive:
      return { ...state, sidebar: { ...state.sidebar, isActive: false } };

    // * charts
    case types.uiUpdateHomeChart:
      return { ...state, homeChart: { ...action.payload } };

    default:
      return state;
  }
};
