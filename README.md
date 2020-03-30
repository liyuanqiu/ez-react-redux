# `ez-react-redux` User Guide

No...no...no🙅‍♂️🙅‍♀️, `ez-react-redux` is a **_bad_** pattern👎👎👎!

You shouldn't use it in any productions.

But it's a life saver in small projects.

- No reducers(out of the box)
- Immediately update your state any time any where without the hindrance of reducers
- `useSelector` supported
- No react context

And it also has the following features:

- Support multiple store instances
- Support `redux` ecosystem(like `redux-logger`)
- Support `Typescript`
- Very small size [![Bundle Size](https://badgen.net/bundlephobia/minzip/ez-react-redux)]()

## EZ at a Glance

```typescript
// Follow a property
const count = useSelector(store, state => state.count);

// Update a property
store.dispatch({
  type: 'add',
  updater(state) {
    return {
      ...state,
      count: state.count + 1,
    };
  },
});
```

### Working example

```typescript
import { createStore, useSelector } from 'ez-react-redux';

type State = {
  count: number;
};

const initialState: State = {
  count: 0,
};

const store = createStore<State>(initialState);

function MyComponent() {
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
}
```

## API Reference

```typescript
import { Action, StoreEnhancer, Store } from 'redux';
/**
 * Updater is a function that describes how to update state.
 * @template S The type of the whole state
 */
export declare type Updater<S = any> = (state: S) => S;
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
export declare function createStore<S = any>(
  initialState: S,
  enhancer?: StoreEnhancer
): Store<S, EZAction<S>>;
/**
 * Property selector
 * @template S The type of the whole state
 */
export declare type Selector<S = any, T = unknown> = (state: S) => T;
/**
 * Property selector for React hooks
 * @template S The type of the whole state
 * @template T The type of the selected property
 */
export declare function useSelector<S = any, T = unknown>(
  store: Store<S>,
  selector: Selector<S, T>
): T;
```
