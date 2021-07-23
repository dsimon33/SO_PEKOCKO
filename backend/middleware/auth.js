// Récupéartion du package jsonwebtoken
const jwt = require('jsonwebtoken');
// Utilisation des variables d'environnement
const dotEnv = require('dotenv');
dotEnv.config();

// Application d'un middleware qui sécurisera toutes les routes
module.exports = (req, res, next) => {
  try {
    // Récupération du token dans le header de la requête (deuxième élément du tableau)
    const token = req.headers.authorization.split(' ')[1];
    // Vérification du TOKEN décodé
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    // Vérification de correspondance entre le userId de la requête et celui encodé par le TOKEN
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';// Si mauvaise correspondance, il y a une erreur
    } else {
      next(); // si tout est ok, on passe au prochain middleware
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};