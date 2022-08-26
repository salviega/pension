import { types } from '../types';

const initialState = {
  isRegisted: false,
  isVerified: false,
};

export const uiAuth = (state = initialState, action) => {
  switch (action.type) {
    case types.authRegisted:
      return { ...state, isRegisted: true };

    case types.authUnregisted:
      return { ...state, isRegisted: false };

    case types.authVerified:
      return { ...state, isVerified: true };

    case types.authUnverified:
      return { ...state, isVerified: false };

    default:
      return state;
  }
};
