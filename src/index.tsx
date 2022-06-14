import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import  appReducer  from './store/reducers/rootReducer';
import AppWithProvider from './App';

const middleware = [thunk];
const composeEnhancers = compose(applyMiddleware(...middleware));

const configureStore = () => {
  return createStore(appReducer, composeEnhancers);
}
const store = configureStore();

ReactDOM.render(
  
  <React.StrictMode> 
    <Provider store={store}>
      <AppWithProvider />
    </Provider> 
  </React.StrictMode>,
  document.getElementById('root')
);
