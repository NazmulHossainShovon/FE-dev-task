// Set item in localStorage with expiry time
export function setLocalStorageWithExpiry(key, value, ttlMinutes) {
  const now = new Date();
  const expiryTime = now.getTime() + ttlMinutes * 60 * 1000;

  const item = {
    value: value,
    expiry: expiryTime,
  };

  localStorage.setItem(key, JSON.stringify(item));
}

// util function to get item from localStorage with expiry check
export function getLocalStorageWithExpiry(key) {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) {
    return null;
  }

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    // Check if item has expired
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (e) {
    localStorage.removeItem(key);
    return null;
  }
}


export function createPageUrl(pageName) {
    return '/' + pageName.toLowerCase().replace(/ /g, '-');
}
