type OptionalArgTuple<T> = T extends undefined ? [] : [T];
type Listener<T> = (...args: OptionalArgTuple<T>) => void;

export function createTypedEvent<T = undefined>() {
  const listeners: Listener<T>[] = [];
  let listenersOnce: Listener<T>[] = [];

  const on = (listener: Listener<T>) => {
    listeners.push(listener);
    return {
      dispose: () => off(listener),
    };
  };

  const once = (listener: Listener<T>): void => {
    listenersOnce.push(listener);
  };

  const off = (listener: Listener<T>) => {
    const callbackIndex = listeners.indexOf(listener);
    if (callbackIndex > -1) listeners.splice(callbackIndex, 1);
  };

  const emit = (...event: OptionalArgTuple<T>) => {
    /** Update any general listeners */
    listeners.forEach((listener) => listener(...event));

    /** Clear the `once` queue */
    if (listenersOnce.length > 0) {
      const toCall = listenersOnce;
      listenersOnce = [];
      toCall.forEach((listener) => listener(...event));
    }
  };

  return {
    on,
    once,
    emit,
  };
}
