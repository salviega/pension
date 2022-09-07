import { types } from '../types'

export const authRegistedAction = () => ({
  type: types.authRegisted
})

export const authUnregistedAction = () => ({
  type: types.authUnregisted
})

export const authVerifiedAction = () => ({
  type: types.authVerified
})

export const authUnverifiedAction = () => ({
  type: types.authUnverified
})

export const authloginAction = (wallet) => ({
  type: types.authlogin,
  payload: wallet
})

export const authLoguotAction = () => ({
  type: types.authLoguot
})
