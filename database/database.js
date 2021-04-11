const mongoose = require('mongoose');

module.exports = mongoose.connect('urmongodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});