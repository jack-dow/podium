import { useSyncExternalStore } from 'react';
import type { Draft } from 'immer';
import produce from 'immer';

export default function createStore<State>(initialState: State) {
  let state = initialState;
  const listeners = new Set<(state: State) => void>();

  const subscribe = (listener: (state: State) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return {
    getState: () => state,
    setState: (newStateFn: (draft: Draft<State>) => State | void) => {
      state = produce(state, (draft) => {
        newStateFn(draft);
      });
      listeners.forEach((listener) => listener(state));
      return state;
    },
    subscribe,
    useStore: <SelectorOutput>(selector: (state: State) => SelectorOutput): SelectorOutput =>
      useSyncExternalStore(subscribe, () => selector(state)),
  };
}
