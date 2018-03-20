const mongoose = require('mongoose')
const md5 = require("md5")
mongoose.connect('mongodb://localhost/news')

const Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

const ArticleSchema = new Schema({
    title: { type: String },
    link: { type: String, unique: true },
    content: { type: String },
    date: { type: Date },
    saved: { type: Boolean, default: false },
    notes: [{ type: Schema.Types.ObjectId, ref: 'Notes' }]
});

const NoteSchema = new Schema({
    note: { type: String },
    article: { type: Schema.Types.ObjectId, ref: 'Articles' }
});

const ArticleModel = mongoose.model("Articles", ArticleSchema)
const NoteModel = mongoose.model("Notes", NoteSchema)

ArticleSchema.path('date').set((timestamp) => {
    return new Date(timestamp)
})

module.exports = {
    ArticleModel, NoteModel
}