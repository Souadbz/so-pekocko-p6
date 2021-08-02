/*** importer le pachage de chiffrement bcrypt ***/
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken'); /*** importer le package tokens d'authentification ***/
const User = require('../models/User'); /*** importer le modèle user ***/
const passwordValidator = require('password-validator'); /*** importer le package mot de passe pour exiger aux utilisateurs d'utiliser des mots de passes avec des majuscules, minuscules, chiffres et caractères spéciaux  ***/

/*** Créer le schéma pour garantir plus de sécurité aux mots de passes des utilisateurs ***/
const schema = new passwordValidator();
schema
    .is().min(6) /*** minimum 6 caractères ***/
    .is().max(15) /*** maximum 15 caractères ***/
    .has().uppercase() /*** mp doit contenir des lettres majuscules ***/
    .has().lowercase() /*** mp doit contenir des lettres miniscules  ***/
    .has().digits(2) /*** mp doit contenir deux chiffres minimun ***/
    .has().not().spaces() /*** mp ne doit pas avoir d'espace ***/
    .is().not().oneOf(['Passw0rd', 'Password123']); /*** liste noire de ces valeurs ***/
/*** POST SIGNUP/enregistrer les nouveaux utilisateurs ***/
exports.signup = (req, res, next) => {
    if (!schema.validate(req.body.password)) {
        /*** si le mot de passe du visiteur ne respecte pas le schéma ***/
        throw {
            error: 'Votre mot de passe doit contenir des majuscules, des minisules, deux chiffres minimum et sans espaces'
        }
    } else {
        bcrypt.hash(req.body.password, 10) /*** hasher ou crypter un mot de passe, l'algorithme fera 10 tours***/
            .then(hash => {
                /*** création un nouveau utilisateur ***/
                const user = new User({
                    email: req.body.email,
                    /*** passer l'email qui est dans le corps de la requête ***/
                    password: hash /*** récpération de mot de passe hashé ***/
                });
                user.save() /*** enregistrer le nouveau utilisateur dans la base de données ***/
                    .then(() => res.status(201).json({
                        message: 'Utilisateur créé !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            })
            .catch(error => res.status(500).json({
                error
            }));
    }
};
/*** connecter les utilisateurs existants ***/
exports.login = (req, res, next) => {
    /*** trouver l'utilisateur dans la base de données ***/
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    error: 'Utilisateur non trouvé !'
                });
            }
            /*** comparer le mot de passe de la requête avec celui de la base de données avec l'utilisation de bcrypt ***/
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    /*** si le mot de passe est incorrect ou inexistant ***/
                    if (!valid) {
                        return res.status(401).json({
                            error: 'Mot de passe incorrect !'
                        });
                    }
                    /*** si le mot de passe est correct ***/
                    res.status(200).json({
                        /*** le serveur backend renvoie le token au front-end avec la réponse ***/
                        userId: user._id,
                        /*** création du token pour sécuriser le compte de l'utilisateur ***/
                        token: jwt.sign( /*** la fonction sign dejsonwebtoken pour encoder un nouveau token ***/ {
                                userId: user._id /*** ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token) ***/
                            },
                            /*** encoder le token avec une chaine de développement temporaire ***/
                            `${process.env.SECRET_KEY}`, {
                                expiresIn: '24h'
                            } /***  la durée de validité du token est 24 heures ***/
                        )
                    });
                })
                .catch(error => res.status(500).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};