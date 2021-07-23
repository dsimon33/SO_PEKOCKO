// Utilisation d'express
const express = require('express');
// Utilisation du routeur d'express avec la méthode 'Router'
const router = express.Router();
// Association des fonctions attribuées aux différentes routes, importation du controller
const userCtrl = require('../controllers/user');

//la logique métier se trouve dans le controller
router.post('/signup', userCtrl.signup); // Création d'un nouvel utilisateur
router.post('/login', userCtrl.login); // Connection de l'utilisateur

module.exports = router;