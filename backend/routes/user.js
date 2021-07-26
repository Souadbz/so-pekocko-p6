const express = require('express');
const router = express.Router(); /*** appeler le router avec la méthode express ***/

const userCtrl = require('../controllers/user');

/*** routes ***/
router.post('/signup', userCtrl.signup); /*** créer un nouvel utilisateur ***/
router.post('/login', userCtrl.login); /*** la connection d'un utilisateur ***/

module.exports = router;