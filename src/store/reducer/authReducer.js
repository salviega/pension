import { types } from '../types';

const initialState = {
  isRegisted: localStorage.getItem('wallet') ? true : false,
  isVerified: localStorage.getItem('wallet') ? true : false,
  wallet: localStorage.getItem('wallet') || 'Connect your Wallet',
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.authRegisted:
      return { ...state, isRegisted: true };

    case types.authUnregisted:
      return { ...state, isRegisted: false };

    case types.authVerified:
      return { ...state, isVerified: true };

    case types.authUnverified:
      return { ...state, isVerified: false };

    case types.authlogin:
      localStorage.setItem('wallet', action.payload);
      return { ...state, wallet: action.payload };

    case types.authLoguot:
      localStorage.clear();
      return { ...state, wallet: 'Connect your Wallet' };

    default:
      return state;
  }
};
