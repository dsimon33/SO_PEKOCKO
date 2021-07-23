// Utilisation du package 'multer' permettant de gérer les fichiers entrant dans les requêtes HTTP, nos images.
const multer = require('multer');

// Création d'un dictionnaire de type 'MIME' contenant un objet nous servant à définir les extensions en fonction du type 'MIME'
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Création d'un objet de configuration pour multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {// Destination des images
    callback(null, 'images'); // Attibution du dossier 'images' du backend
  },
  filename: (req, file, callback) => { // Nom du fichier image
    const name = file.originalname.split(' ').join('_'); // remplacement des espaces par des underscores
    const extension = MIME_TYPES[file.mimetype];
    // appelle du callback avec null pour stipuler qu'il n'y a pas d'erreur puis (nom du fichier,timestamp,.,extension)
    callback(null, name + Date.now() + '.' + extension);
  }
});
// export du fichier avec la méthode single pour spécifier qu'il s'agit d'un fichier unique
module.exports = multer({storage: storage}).single('image');