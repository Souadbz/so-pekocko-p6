const mongoose = require('mongoose'); /*** importer le package mongoose ***/
const uniqueValidator = require('mongoose-unique-validator'); /*** le validateur va vérifier que l'email est unique ***/

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
/*** le pluging vérifie que l'eamil est unique ***/
userSchema.plugin(uniqueValidator);

/*** exporter le modèle User ***/
module.exports = mongoose.model('User', userSchema);