import {
  Action,
  Reducer,
  createStore as createReduxStore,
  StoreEnhancer,
  Store,
  Middleware,
} from 'redux';
import { useState, useEffect } from 'react';
import produce from 'immer';
import util from 'util';

function assert(condition: boolean, message = 'Error'): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Updater is a function that describes how to update state.
 * @template S The type of the whole state
 */
export type Updater<S = any> = (state: S) => void;

/**
 * EZAction is the only action type for `ez-react-redux`
 * @template S The type of the whole state
 */
export interface EZAction<S = any> extends Action {
  updater: Updater<S>;
}

interface MutateStateAction<S = any> extends Action {
  nextState: S;
}

/**
 * Create the store instance
 * @template S The type of the whole state
 */
export function createStore<S = any>(
  initialState: S,
  enhancer?: StoreEnhancer
) {
  // create redux reducer
  const reducer: Reducer<S, MutateStateAction<S>> = (
    state = initialState,
    action
  ) => {
    return action.nextState;
  };

  const immerAsyncMiddleware: Middleware = store => next => (
    action: EZAction<S>
  ) => {
    const nextState = produce(store.getState(), action.updater);
    if (nextState instanceof Promise) {
      nextState.then(state =>
        store.dispatch({
          type: action.type,
          nextState: state,
        })
      );
    } else {
      store.dispatch({
        type: action.type,
        nextState,
      });
    }
    return next(action);
  };

  // create redux store instance
  return createReduxStore<S, EZAction<S>, unknown, unknown>(reducer, enhancer);
}

/**
 * Property selector
 * @template S The type of the whole state
 */
export type Selector<S = any, T = unknown> = (state: S) => T;

/**
 * Property selector for React hooks
 * @template S The type of the whole state
 * @template T The type of the selected property
 */
export function useSelector<S = any, T = unknown>(
  store: Store<S>,
  selector: Selector<S, T>
) {
  const [value, setValue] = useState(selector(store.getState()));
  useEffect(() => {
    return store.subscribe(() => {
      setValue(selector(store.getState()));
    });
  }, [store, selector]);
  return value;
}
