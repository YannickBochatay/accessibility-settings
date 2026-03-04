export function createState(initialState) {

  const listeners = [];
  
  return {
    state: new Proxy(initialState, {
      set(target, prop, value) {
        target[prop] = value;
        listeners.forEach(callback => callback(prop, value));
        return true;
      }
    }),
    onStateChange(callback) {
      listeners.push(callback);
    },
    offStateChange(callback) {
      const index = listeners.indexOf(callback);
      if (index !== -1) listeners.splice(index, 1);
    }
  };
}