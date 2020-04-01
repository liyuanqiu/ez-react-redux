import {
  Action,
  Reducer,
  createStore as createReduxStore,
  StoreEnhancer,
  Store,
} from 'redux';
import { useState, useEffect } from 'react';
import produce from 'immer';

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
  updater?: Updater<S>;
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
  const reducer: Reducer<S> = (state = initialState, action: EZAction<S>) => {
    if (action.updater !== undefined) {
      return produce(state, action.updater);
    }
    return state;
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
    store.subscribe(() => {
      setValue(selector(store.getState()));
    });
  }, [store, selector]);
  return value;
}
