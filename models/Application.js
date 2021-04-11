const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
    questions: { type: String, required: true}
});

const Application = module.exports = mongoose.model('User', AppSchema);