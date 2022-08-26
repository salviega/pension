import { types } from '../types';

const initialState = {
  modal: {
    isOpen: false,
    data: null,
  },
  spinner: { isActive: false },
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

    default:
      return state;
  }
};
