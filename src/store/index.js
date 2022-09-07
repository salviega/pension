import thunk from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import { uiReducer } from './reducer/uiReducer'
import { authReducer } from './reducer/authReducer'

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

const reducers = combineReducers({
  ui: uiReducer,
  auth: authReducer
})

export const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)))
