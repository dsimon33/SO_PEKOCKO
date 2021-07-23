// Utilisation d'express
const express = require('express');
// Utilisation du routeur d'express avec la méthode 'Router'
const router = express.Router();

// Importation du middleware auth pour sécuriser les routes
const auth = require('../middleware/auth');
// Association des fonctions attribuées aux différentes routes, importation du controller
const sauceCtrl = require('../controllers/sauce');
// Importation du middleware 'multer-config' pour la gestion des images
const multer = require('../middleware/multer-config');

//la logique métier se trouve dans le controller
router.post('/', auth, multer, sauceCtrl.createSauce); // Création de Sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Modifie et met à jour la sauce en fonction de l'identifiant transmis
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Supprime la sauce en fonction de l'id transmis
router.get('/:id', auth, sauceCtrl.getOneSauce); // Accéder à une sauce en fonction de l'id transmis
router.get('/', auth, sauceCtrl.getAllSauces); // Accéder à l'ensemble des sauces
router.post('/:id/like', auth, sauceCtrl.likeDislike); // Permet d'indiquer le statut like ou dislike

module.exports = router;