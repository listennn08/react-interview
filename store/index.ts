import { createStore, Store } from 'redux'
import { createWrapper, Context } from 'next-redux-wrapper'
import rootReducer from './reducers'

import type { IState } from 'types'

export const { withRedux } = createWrapper<Store<IState>>(
  (_context: Context) => createStore(rootReducer),
  { debug: true }
)
