// Toute la logique métier se trouve dans ce fichier, la logique de routing se trouve dans le dossier 'routes', fichier 'sauce.js'

// Récupération du modèle 'sauce'
const Sauce = require('../models/Sauce');

// Récupération du module 'file system' de Node (permet de modifier le sytème de fichier, y compris la suppression que nous utiliserons pour nos images)
const fs = require('fs');


// Création d'une sauce 
exports.createSauce = (req, res, next) => {
  // Récupération des données envoyées par le front-end dans une variable en les transformant en objet js
  const sauceObject = JSON.parse(req.body.sauce);
  // Suppression de l'id envoyé par le front-end car celui-ci sera crée par le base MongoDB
  delete sauceObject._id;
  // Création d'une instancce du modèle Sauce
  const sauce = new Sauce({
    ...sauceObject,
    // Modification de l'URL de l'image afin d'obtenir l'URL complète de façon dynamique
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  // Sauvegarde de la sauce dans la base de données
  sauce.save()
    // Envoi d'une réponse au frontend avec statut '201' si la création se passe bien
    .then(() => res.status(201).json({ message: 'sauce enregistrée !' }))
    // Sinon, envoi d'un code erreur '400'
    .catch(error => res.status(400).json({ error }));
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  // Vérification de l'existence d'une nouvelle image
  const sauceObject = req.file ?
    {
      // Si existence d'une nouvelle image, récupération de l'objet js
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      // Sinon, récupération du corps de la requête
    } : { ...req.body };
  // Mise à jour de la sauce dans la base de données ave application des paramètres de 'sauceObject'
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    // Envoi d'une réponse au frontend avec statut '200' si la modification se passe bien
    .then(() => res.status(200).json({ message: 'sauce modifiée !' }))
    // Sinon, envoi d'un code erreur '400'
    .catch(error => res.status(400).json({ error }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  // Récupération de l'objet afin d'obtenir l'url de l'image et la supprimer de la base
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // Récupération dans une constante de l'url de l'image et récupération du deuxième élément du tableau généré par 'split'
      const filename = sauce.imageUrl.split('/images/')[1];
      // Appel de la fonction 'unlink' pour suppression du fichier
      fs.unlink(`images/${filename}`, () => {
        // Suppression de l'objet de la base
        Sauce.deleteOne({ _id: req.params.id })
          // Envoi d'une réponse au frontend avec statut '200' si la suppression se passe bien
          .then(() => res.status(200).json({ message: 'sauce supprimée !' }))
          // Sinon, envoi d'un code erreur '400'
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Affichage d' une seule sauce
exports.getOneSauce = (req, res, next) => {
  // Récupération de l'objet avec la méthode 'findOne' , on passe en objet de comparaison l'id de la sauce en indiquant qu'il faut qu'il soit le même que le paramètre de requête
  Sauce.findOne({ _id: req.params.id })
    // Envoi d'une réponse au frontend avec statut '200' et l'objet si la récupération se passe bien
    .then(sauce => res.status(200).json(sauce))
    // Sinon, envoi d'un code erreur '404' pour stimuler que l'objet est introubale
    .catch(error => res.status(404).json({ error }));
};

// Affichage de toutes les sauces
exports.getAllSauces = (req, res, next) => {
  // Récupération du tableau avec toutes les sauces avec la méthode 'find'
  Sauce.find()
    // Envoi d'une réponse au frontend avec statut '200' et le tableau si la récupération se passe bien
    .then(sauces => res.status(200).json(sauces))
    // Sinon envoi d'une message d'erreur '400'
    .catch(error => res.status(400).json({ error }));
};

/* Afficher les likes et dislikes */
exports.likeDislike = (req, res, next) => {
  // Création d'une constante pour récupération des likes présent dans le body
  const like = req.body.like
  // Récupération de l'userId
  const userId = req.body.userId
  // Récupération de l'id de la sauce
  const sauceId = req.params.id

  if (like === 1) { // Pour like une sauce
    // Récupération de l'objet
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        // Vérification que l'utilisateur n'est pas déja liké la sauce
        if (sauce.usersLiked.includes(userId)) {
          console.log('Like déja ajouté !')
        }
        else {
          Sauce.updateOne({ _id: sauceId }, {
            $push: { usersLiked: userId },// on ajoute l'utilisateur
            $inc: { likes: +1 },// on incrémente likes de 1
          })
          .then(() => res.status(200).json({ message: 'Like ajouté !' }))
          .catch((error) => res.status(400).json({ error }))
        }
      })
      .catch((error) => res.status(404).json({ error }))
  }
  
  if (like === -1) { // Pour dislike une sauce
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        // Vérification que l'utilisateur n'est pas déja disliké la sauce
        if (sauce.usersDisliked.includes(userId)) {
          console.log('Dislike déja ajouté !')
        }
        else {
          Sauce.updateOne({ _id: sauceId }, {
            $push: { usersDisliked: userId }, // on ajoute l'utilisateur 
            $inc: { dislikes: +1 },// on incrémente dislikes de 1
          })
          .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
          .catch((error) => res.status(400).json({ error }))
        }
      })
      .catch((error) => res.status(404).json({ error }))
  }

  if (like === 0) {// Annulation d'un like ou dislike
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        // Annulation d'un like
        // Vérification que l'utilisateur est bien liké la sauce
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne({ _id: sauceId }, {
            $pull: { usersLiked: userId }, // on retire l'utilisateur
            $inc: { likes: -1 }, // on incrémente likes de -1
          })
            .then(() => res.status(200).json({ message: 'Like retiré !' }))
            .catch((error) => res.status(400).json({ error }))
        }
        // Annulation d'un dislike
        // Vérification que l'utilisateur est bien disliké la sauce
        else if (sauce.usersDisliked.includes(userId)) {//
          Sauce.updateOne({ _id: sauceId }, {
            $pull: { usersDisliked: userId }, // on retire l'utilisateur
            $inc: { dislikes: -1 }, // on incrémente dislikes de -1
          })
            .then(() => res.status(200).json({ message: 'Dislike retiré !' }))
            .catch((error) => res.status(400).json({ error }))
        }
      })
      .catch((error) => res.status(404).json({ error }))
  }
}