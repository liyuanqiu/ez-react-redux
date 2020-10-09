import React from 'react';
import * as ReactDOM from 'react-dom';
import { Default as Thing } from '../stories/Thing.stories';
import { createStore } from '../src';

describe('Thing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Thing />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('Basic features', () => {
  type State = {
    count: number;
  };
  const store = createStore<State>({
    count: 0,
  });
  it('can read the state', () => {
    expect(store.getState().count).toBe(0);
  });
  it('can mutate the state', () => {
    store.dispatch({
      type: 'increment',
      updater(state) {
        // eslint-disable-next-line no-param-reassign
        state.count += 1;
      },
    });
    expect(store.getState().count).toBe(1);
  });
  it('can mutate the state async', () => {
    store.dispatch({
      type: 'increment_async',
      updater(state) {
        setTimeout(() => {
          // eslint-disable-next-line no-param-reassign
          state.count += 1;
        });
      },
    });
    expect(store.getState().count).toBe(1);
  });
});
