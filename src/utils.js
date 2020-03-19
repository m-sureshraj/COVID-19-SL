exports.convertObjectValuesToNumber = (obj = {}) => {
  return Object.entries(obj).reduce((acc, [k, v]) => ({ ...acc, [k]: +v }), {});
};
