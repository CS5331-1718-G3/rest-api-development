const mung = require('express-mung');

const transformer = function(json) {
  const body = { status: true };

  if (json) {
    body.result = json;
  }

  return body;
};

module.exports = function() {
  return mung.json(transformer);
};
