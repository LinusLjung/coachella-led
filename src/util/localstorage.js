const timeoutHandles = {};

function debounce(callback, key = 'general', timeout = 500) {
  return function(key, value) {
    if (timeoutHandles[key]) {
      window.clearTimeout(timeoutHandles[key]);
    }

    timeoutHandles[key] = window.setTimeout(function() { callback(key, value); }, timeout);
  };
}

export const setValue = debounce((key, value) => {
  window.localStorage.setItem(key, value);
});

export function getValue(key) {
  return window.localStorage.getItem(key);
}
