const express = require('express'); /*** importer express pour avoir le router ***/
const router = express.Router(); /*** appeler le router avec la méthode express ***/

const userCtrl = require('../controllers/user'); /*** importer le controllers user pour associer les fonctions aux routes ***/

/*** les routes d'authentification ***/
router.post('/signup', userCtrl.signup); /*** créer un nouvel utilisateur ***/
router.post('/login', userCtrl.login); /*** la connection d'un utilisateur ***/

module.exports = router;