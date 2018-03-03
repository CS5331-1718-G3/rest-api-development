const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const DiarySchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    publish_date: { type: Date, required: true },
    public: { type: Boolean, required: false },
    text: { type: String, required: false },
  },
  { versionKey: false }
);

DiarySchema.plugin(autoIncrement.plugin, {
  model: 'Diary',
  field: 'id',
  startAt: 1,
});

const Diary = mongoose.model('Diary', DiarySchema);

module.exports = Diary;
