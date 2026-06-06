export const DAYS = new Proxy([], {
  get(target, prop) {
    if (window.__GRE_DAYS) {
      if (typeof window.__GRE_DAYS[prop] === 'function') {
        return window.__GRE_DAYS[prop].bind(window.__GRE_DAYS);
      }
      return window.__GRE_DAYS[prop];
    }
    return target[prop];
  }
});
