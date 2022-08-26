import { types } from '../types';

const initialState = {
  modal: {
    isOpen: false,
    data: null,
  },
};

export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.uiModalOpen:
      return { ...state, modal: { ...state.modal, isOpen: true } };

    case types.uiModalClose:
      return { ...state, modal: { ...state.modal, isOpen: false } };

    case types.uiModalLoadDara:
      return { ...state, modal: { ...state.modal, data: action.payload } };

    case types.uiModalUnloadDara:
      return { ...state, modal: { ...state.modal, data: null } };

    default:
      return state;
  }
};
