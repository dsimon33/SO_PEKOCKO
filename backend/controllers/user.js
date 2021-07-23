// Utilisation de l'algorithme bcrypt pour hascher le mot de passe des Utilisateurs
const bcrypt = require('bcrypt');
// Utilisation de jsonwebtoken afin d'attribuer un token à l'utilisateur au moment de la connexion
const jwt = require('jsonwebtoken');
// Récupération du modèle User (shéma mongoose)
const User = require('../models/User');
// Utilisation des variables d'environnement
const dotEnv = require('dotenv');
dotEnv.config();

// Sauvegarde d'un nouvel utilsateur
exports.signup = (req, res, next) => {
  // On appelle la méthode 'hash' de 'bcrypt' pour le mot de passe de l'utilisateur
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // Création du nouvel utilisateur
      const user = new User({
        email: req.body.email,
        password: hash // Récupération du mot de passe hasché de bcrypt
      });
      // Enregistrement de l'utilsateur dans la base de donnée
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Connexion d'un utilisateur
exports.login = (req, res, next) => {
  // Récupération de l'utilisateur dans la BDD
  User.findOne({ email: req.body.email })
    .then(user => {
      // Si l'utilisateur n'est pas trouvé, on renvoie un code erreur '401' 'non autorisé'
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // On utilise bcrypt pour comparer les hashs et s'assurer qu'ils ont le même string d'origine
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          // Si la comparaison renvoie 'false', alors il y a ue erreur utilisateur ou mot de passe
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          console.log(obfuscateemail(req.body.email));
          // Si la comparaison revoie 'true', envoie d'un staut '200' ainsi que d'un objet JSON
          res.status(200).json({
            userId: user._id,
            email: obfuscateemail(req.body.email),// email obtenu par la fonction 'obfucateemail'
            token: jwt.sign( // Encodage d'un nouveu TOKEN
              { userId: user._id },// Encodage de l'userId
              process.env.TOKEN_SECRET, // Clé d'encodage récupérée dans les variables d'environnement.
              { expiresIn: '24h' } // Expiration au bout de 24h
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

function obfuscateemail (email) {
  const emailSplit = email.split("@");// Décomposition du mail
  const beforeArob = emailSplit[0]; // Récupération de la partie situé avant '@'
  const emailRight = emailSplit[1].split("."); // Décomposition de la partie située aprés '@'
  const afterArob = emailRight[0]; // Récupération de la partie situé aprés '@' et avant '.'
  const maskLeft = replaceWithStar(beforeArob);
  const maskRight = replaceWithStar(afterArob);
  return `${maskLeft}@${maskRight}.${emailRight[1]}`// Renvoie l'aresse mail obfusquée
};

function replaceWithStar (str) {
  let outPut = "";
  for (let i=0; i<str.length; i++) {
    if (i<str.length/2) {
      outPut += "*";
    }
    else {
      outPut += str[i];
    }
  }
  return outPut
};