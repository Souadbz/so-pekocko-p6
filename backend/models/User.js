const mongoose = require('mongoose'); /*** importer le package mongoose ***/
const uniqueValidator = require('mongoose-unique-validator'); /*** Les erreurs générées par défaut par MongoDB pouvant être difficiles à résoudre, nous installerons un package de validation pour pré-valider les informations avant de les enregistrer  ***/

/*** création du modèle utilisateur ***/
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
/*** le pluging vérifie que l'email est unique ***/
userSchema.plugin(uniqueValidator);

/*** exporter le modèle User ***/
module.exports = mongoose.model('User', userSchema);