const mongoose = require('mongoose'); /*** importer le package mongoose ***/
/*** Les erreurs générées par défaut par MongoDB pouvant être difficiles à résoudre,
 *  nous installerons un package de validation pour pré-valider les informations avant de les enregistrer  ***/
const uniqueValidator = require('mongoose-unique-validator');

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
/*** le plugin vérifie que l'email est unique ***/
userSchema.plugin(uniqueValidator);

/*** exporter le modèle User ***/
module.exports = mongoose.model('User', userSchema);