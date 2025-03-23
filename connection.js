const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');

const data = mongoose.model('contacts', { 
    name:  {
        type : String,
        required : true
    },
    email : {
        type : String
    },
    phone : {
        type : String,
        required : true
    }
});

module.exports = data