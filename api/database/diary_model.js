const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

DiarySchema = mongoose.Schema({
  title: { type: String, required: true},
  author: { type: String, required: true},
  publish_date: { type: Date, required: true},
  public: { type: Boolean, required: false},
  text: { type: String, required: false}
});

const Diary = mongoose.model('Diary', DiarySchema);

DiarySchema.plugin(autoIncrement, {inc_field: 'id'});

module.exports = Diary;
