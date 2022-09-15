const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SwagaSchema = new Schema({
    name: {type: String, required: true},
    job: {type: String, required: true},
    state: {type: String, required: true},
    email: {type: String, required: true},
    username: {type: String, required: true},
    number: {type: String, required:true },
    img:
    {
        data: Buffer,
        contentType: String
    },
    
});

const Userdb = mongoose.model('User', SwagaSchema);

module.exports = Userdb;


