let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let postSchema = new Schema({
    id: String,
    title: String,
    date: Date,
    description: String,
    text: String,
    country: String,
    imageUrl: String
})

let Post = mongoose.model('Post', postSchema);

module.exports = {
    Post: Post
} 