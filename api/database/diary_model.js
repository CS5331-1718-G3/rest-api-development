var mongoose = require('mongoose');

var Diary = mongoose.model('Diary', {
  id: { type: Number, required: true},
  title: { type: String, required: true},
  author: { type: String, required: true},
  publish_date: { type: Date, required: true},
  public: { type: Boolean, required: false},
  text: { type: String, required: false}
});

module.exports = Diary;
