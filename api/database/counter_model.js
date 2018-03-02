var mongoose = require('mongoose');

var Counter = mongoose.model('Counter', {
  id: String,
  seq: Number
});

module.exports = Counter;