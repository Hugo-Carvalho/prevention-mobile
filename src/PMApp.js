import React from 'react';

import Router from './Router'

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import Thunk from 'redux-thunk';

import { composeWithDevTools } from 'remote-redux-devtools';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';

import rootReducer from './reducers';

const persistConfig = {
  key: 'pm-root',
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, composeWithDevTools(
  applyMiddleware(Thunk)
));

const persistor = persistStore(store);  

const PMApp = prop => (
  <Provider store = {store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router />
    </PersistGate>
  </Provider>
);

export default PMApp;