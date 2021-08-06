const bcrypt = require('bcrypt'); /*** importer le package de chiffrement bcrypt ***/
const jwt = require('jsonwebtoken'); /*** importer le package jsonwebtoken pour créer des tokens d'authentification et de les vérifier ***/
const User = require('../models/User'); /*** importer le modèle user ***/
const passwordValidator = require('password-validator'); /*** importer le package mot de passe pour exiger aux utilisateurs d'utiliser des mots de passes avec des majuscules, minuscules, chiffres et caractères spéciaux  ***/
var CryptoJS = require("crypto-js"); /*** crypto-js permet de crypter les emails ***/

/*** Créer le schéma pour garantir plus de sécurité aux mots de passes des utilisateurs ***/
const schema = new passwordValidator();
schema
    .is().min(6) /*** minimum 6 caractères ***/
    .is().max(15) /*** maximum 15 caractères ***/
    .has().uppercase() /*** mot de passe doit contenir des lettres majuscules ***/
    .has().lowercase() /*** mot de passe doit contenir des lettres miniscules  ***/
    .has().digits(2) /*** mot de passe doit contenir deux chiffres minimun ***/
    .has().not().spaces() /*** mot de passe ne doit pas avoir d'espace ***/
    .is().not().oneOf(['Passw0rd', 'Password123']); /*** Ces valeurs sont dans la liste noire ***/

/*** POST /api/auth/signup /enregistrer les nouveaux utilisateurs ***/
exports.signup = (req, res, next) => {
    /*** hasher l'email ***/
    var cryptedEmail = CryptoJS.HmacSHA256(req.body.email, `${process.env.EMAILSECRET_KEY}`).toString();
    /*** si le mot de passe du visiteur ne respecte pas le schéma ***/
    if (!schema.validate(req.body.password)) {

        throw {
            error: 'Votre mot de passe doit contenir des majuscules, des minisules, deux chiffres minimum et sans espaces'
        }
    } else {
        /*** appeler bycrpt et hasher le mot de passe, l'algorithme fera 10 tours***/
        bcrypt.hash(req.body.password, 10)
            /*** récupérer le hash du mot de passe pour l'enregistrer dans le user et donc la base de données ***/
            .then(hash => {
                /*** création un nouveau utilisateur/inscription ***/
                const user = new User({
                    email: cryptedEmail,
                    /*** passer l'email hashé qui est dans le corps de la requête ***/
                    password: hash /*** récpération de mot de passe hashé ***/
                });
                /*** enregistrer le nouveau utilisateur dans la base de données ***/
                user.save()
                    .then(() => res.status(201).json({
                        message: 'Utilisateur créé !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            }) /*** erreur serveur ***/
            .catch(error => res.status(500).json({
                error
            }));
    }
};
/***POST/ api/auth/login /connecter les utilisateurs existants ***/
exports.login = (req, res, next) => {
    /*** hasher l'email ***/
    var cryptedEmail = CryptoJS.HmacSHA256(req.body.email, `${process.env.EMAILSECRET_KEY}`).toString();

    /*** trouver l'utilisateur dans la base de données ***/
    User.findOne({
            email: cryptedEmail
        })
        .then(user => {
            if (!user) {
                /*** si on ne trouve pas le user ***/
                return res.status(401).json({
                    /*** erreur non autorissation */
                    error: 'Utilisateur non trouvé !'
                });
            }
            /*** comparer le mot de passe de la requête avec celui de la base de données avec l'utilisation de bcrypt ***/
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    /*** si le mot de passe est incorrect ou inexistant ***/
                    if (!valid) {
                        return res.status(401).json({
                            /*** erreur non autorisation ***/
                            error: 'Mot de passe incorrect !'
                        });
                    }
                    /*** si le mot de passe est correct ***/
                    res.status(200).json({
                        /*** le serveur backend renvoie le userId et le token au front-end avec la réponse/
                         * le frontend va lier ce token à chaque requête, ensuite le serveur va vérifier chaque requête authentifiée ***/
                        userId: user._id,
                        /*** l'identifiant de l'utilisateur dans la base de données ***/
                        /*** création du token pour sécuriser le compte de l'utilisateur ***/
                        token: jwt.sign( /*** la fonction sign de jsonwebtoken est pour encoder un nouveau token ***/ {
                                userId: user._id /*** ce token contient l'id de l'utilisateur en tant que payload (les données qu'on souhaite encodées dans le token) ***/
                            },
                            /***  encoder le token avec une chaine secréte de développement temporaire ***/
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