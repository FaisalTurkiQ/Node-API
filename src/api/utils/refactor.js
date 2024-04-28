const objectProperty = (oldKeys, newKeys, data) => {
  if (Array.isArray(data) && data.length > 0) {
    return data.map(obj => objectProperty(oldKeys, newKeys, obj));
  }
  for (let i = 0; i < newKeys.length; i++) {
    if (oldKeys[i] in data) {
      const value = data[oldKeys[i]];
      delete data[oldKeys[i]];
      data[newKeys[i]] = value;
    }
  }
  return data;
}

module.exports = { objectProperty };
