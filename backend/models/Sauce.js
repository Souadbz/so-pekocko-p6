const mongoose = require('mongoose'); /*** importer mongoose ***/
/***  création du modèle des sauces ***/
const sauceSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        minlength: [3, "minimum 3 caractères"],
        maxlength: [30, "minimum 30 caractères"],
        required: true
    },
    manufacturer: {
        type: String,
        minlength: [3, "minimum 3 caractères"],
        maxlength: [30, "minimum 30 caractères"],
        required: true
    },
    description: {
        type: String,
        minlength: [15, "minimum 15 caractères"],
        maxlength: [130, "minimum 130 caractères"],
        required: true
    },
    mainPepper: {
        type: String,
        minlength: [3, "minimum 3 caractères"],
        maxlength: [30, "minimum 30 caractères"],
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    heat: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
        required: false,
        default: 0
    },
    dislikes: {
        type: Number,
        required: false,
        default: 0
    },
    usersLiked: {
        type: [String],
        required: false
    },
    usersDisliked: {
        type: [String],
        required: false
    },
});
/*** exporter le modèle sauce ***/
module.exports = mongoose.model('Sauce', sauceSchema);