const mung = require('express-mung');

function removeEmpty(json) {
  if (!json) return json;

  const filter = key =>
    json[key] === null || json[key] === undefined || json[key] === '';

  Object.keys(json)
    .filter(filter)
    .forEach(key => delete json[key]);

  return json;
}

const transformer = function(json) {
  // Don't transform errors.
  if (json && json.status === false) {
    return removeEmpty(json);
  }

  // return removeEmpty({ status: true, result: json });
};

module.exports = function() {
  return mung.json(transformer);
};
