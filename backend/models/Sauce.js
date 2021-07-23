// Importation de 'mongoose'
const mongoose = require('mongoose');

// Création d'un shéma mongoose
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },// Mise par défaut des likes à 0
  dislikes: { type: Number, default: 0 },// Mise par défaut des dislikes à 0
  usersLiked: { type: [String], default: [] }, // Création tableau vide pour les utilisateurs qui like
  usersDisliked: { type: [String], default: [] }, // Création d'un tableau vide pour les utilisateurs qui dislike
});

// Export du shéma de données
module.exports = mongoose.model('Sauces', sauceSchema);