const mung = require('express-mung');

const transformer = function(json, res) {
  return {
    status: true,
    result: json,
  };
};

module.exports = function() {
  return mung.json(transformer);
};
