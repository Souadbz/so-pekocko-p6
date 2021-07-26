const express = require('express');
const router = express.Router(); /*** appeler le router avec la méthode express ***/

const sauceCtrl = require('../controllers/sauce'); /*** importer le controllers sauce***/
const auth = require('../middleware/auth'); /*** la récupération de  la configuration d'authentification de JsonWebToken ***/
const multer = require('../middleware/multer-config'); /*** importer multer pour la gestion des images ***/


/*** enregistrer les sauces dans la base de données ***/
router.post('/', auth, multer, sauceCtrl.createSauce);
/*** récuperer les sauces dans la base de données ***/
router.get('/', auth, sauceCtrl.getSauces);
/*** récupérer une sauce spécifique ***/
router.get('/:id', auth, sauceCtrl.getOneSauce);
/*** modifier la sauce ***/
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
/*** supprimer la sauce***/
router.delete('/:id', auth, sauceCtrl.deleteSauce);
/*** like ou dislike ***/
router.post('/:id/like', auth, sauceCtrl.likeDislike);

module.exports = router;