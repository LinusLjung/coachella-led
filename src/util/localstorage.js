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

export function getJSONValue(key) {
  const value = getValue(key);

  return value ? JSON.parse(value) : value;
}

function setJSONValue(key, value) {
  return setValue(key, JSON.stringify(value));
}

export const setScreen = debounce((id, screen) => {
  const screens = getJSONValue('screens') || {};

  screens[id] = screen;

  setJSONValue('screens', screens);
});

export function getScreen(id) {
  const screens = getJSONValue('screens');

  return screens && screens[id];
}
