const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookSchema = new Schema({
    title: {
        type: String, required: true 
        
    },
    commentcount: {
        type: Number, default: 0
    },
    comments: String

});

const Book = mongoose.model("Book", BookSchema);

exports.Book = Book;