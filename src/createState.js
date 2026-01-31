export function createState(initialState) {

  const listeners = [];

  function createProxy(target) {
    return new Proxy(target, {

      set(target, prop, value) {
        target[prop] = value;
        listeners.forEach(callback => callback(String(prop), value));
        return true;
      },

      get(target, prop) {
        // from Chris Ferdinandi : https://gomakethings.com/guides/proxies/nesting/ 
        if (prop === '_isProxy') return true;
        if (target[prop]?._isProxy) return target[prop];
        if (target[prop] && typeof target[prop] === 'object') return createProxy(target[prop]);
        return target[prop];
      },
    });
  }
  
  return {
    state: createProxy(initialState),
    onStateChange(callback) {
      listeners.push(callback);
    },
    offStateChange(callback) {
      const index = listeners.indexOf(callback);
      if (index !== -1) listeners.splice(index, 1);
    }
  };
}