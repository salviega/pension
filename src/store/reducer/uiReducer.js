import { types } from '../types';

const initialState = {
  isModalOpen: false,
};

export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.uiModalOpen:
      return { ...state, isModalOpen: true };

    case types.uiModalClose:
      return { ...state, isModalOpen: false };

    default:
      return state;
  }
};
