import React from 'react';
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';
import { createStore, useSelector } from '../src';

export default {
  title: 'ez-react-redux',
};

type State = {
  count: number;
};
const initialState: State = {
  count: 0,
};
const store = createStore<State>(initialState, applyMiddleware(logger));

export const Default = () => {
  const count = useSelector(store, state => state.count);
  function add() {
    store.dispatch({
      type: 'add',
      updater(state) {
        return {
          ...state,
          count: state.count + 1,
        };
      },
    });
  }
  return (
    <div>
      <h1>{count}</h1>
      <button type="button" onClick={add}>
        +
      </button>
    </div>
  );
};
