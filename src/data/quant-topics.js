export const QUANT_TOPICS = new Proxy([], {
  get(target, prop) {
    if (window.__GRE_QUANT_TOPICS) {
      if (typeof window.__GRE_QUANT_TOPICS[prop] === 'function') {
        return window.__GRE_QUANT_TOPICS[prop].bind(window.__GRE_QUANT_TOPICS);
      }
      return window.__GRE_QUANT_TOPICS[prop];
    }
    return target[prop];
  }
});
