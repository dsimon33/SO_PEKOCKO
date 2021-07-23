// Importation de 'mongoose'
const mongoose = require('mongoose');

// Importation du plugin 'mongoose-unique-validator' afin de s'assurer que plusieurs utilisateur ne pourront pas utliser la même adresse mail
const uniqueValidator = require('mongoose-unique-validator');

// Création du shéma de mongoose
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // Application du plugin 'uniqueValidator à notre shéma

//export du shéma de données
module.exports = mongoose.model('User', userSchema);