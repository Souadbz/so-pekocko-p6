/*** importer express pour avoir le router ***/
const express = require('express');
/*** appeler le router avec la méthode express/ il va nous permettre d'utiliser le mot router. à la place de app. ***/
const router = express.Router();
const sauceCtrl = require('../controllers/sauce'); /*** importer le controllers sauce pour associer les fonctions aux routes***/
const auth = require('../middleware/auth'); /*** la récupération de  la configuration d'authentification de JsonWebToken ***/
const multer = require('../middleware/multer-config'); /*** importer multer pour la gestion des images ***/


/*** enregistrer les sauces dans la base de données/ importer du dossier controllers la fonction createSauce ***/
router.post('/', auth, multer, sauceCtrl.createSauce);
/*** récuperer les sauces dans la base de données/ importer du dossier controllers la fonction getSauce  ***/
router.get('/', auth, sauceCtrl.getSauces);
/*** récupérer une sauce spécifique importer du dossier controllers la fonction getOneSauce  ***/
router.get('/:id', auth, sauceCtrl.getOneSauce);
/*** modifier la sauce/ importer du dossier controllers la fonction modifySauce  ***/
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
/*** supprimer la sauce/ importer du dossier controllers la fonction deleteSauce ***/
router.delete('/:id', auth, sauceCtrl.deleteSauce);
/*** like ou dislike/ importer du dossier controllers la fonction likeDislike ***/
router.post('/:id/like', auth, sauceCtrl.likeDislike);

module.exports = router;