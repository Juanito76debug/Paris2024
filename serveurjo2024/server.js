import express from "express";
import path from "path";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";
import mongoose from "mongoose"; // Assure-toi d'avoir installé mongoose

const app = express();
const port = 3000;

app.use(cors()); // Ajoute cette ligne pour permettre les requêtes cross-origin
app.use(express.static(path.join("C:/Users/juan_/Documents/Paris2024/jo2024")));
app.use(bodyParser.json());

// Connexion à la base de données MongoDB
mongoose.connect("mongodb://localhost:27017/jo2024");

// Définition du modèle utilisateur
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Exemple de données de messages
let messages = [
  { id: 1, content: "Message 1" },
  { id: 2, content: "Message 2" },
  // Ajoute d'autres messages ici
];

// Exemple de données de membres connectés
let connectedMembers = 5; // Remplace par la logique réelle pour compter les membres connectés

// Route pour récupérer le nombre de messages
app.get("/api/messageCount", (req, res) => {
  res.json({ count: messages.length });
});

// Route pour récupérer le nombre de membres connectés
app.get("/api/connectedMembers", (req, res) => {
  res.json({ count: connectedMembers });
});

// Route pour servir le fichier HTML de la page d'accueil
app.get("/", (req, res) => {
  res.sendFile(
    path.join("C:/Users/juan_/Documents/Paris2024/jo2024", "index.html")
  );
});

// Route pour servir le fichier HTML de la page d'inscription
app.get("/register", (req, res) => {
  res.sendFile(
    path.join("C:/Users/juan_/Documents/Paris2024/jo2024", "register.html")
  );
});

// Route pour servir le fichier HTML de la page "À propos"
app.get("/about", (req, res) => {
  res.sendFile(
    path.join("C:/Users/juan_/Documents/Paris2024/jo2024", "about.html")
  );
});

// Route pour gérer l'inscription
app.post("/api/register", (req, res) => {
  const { username, email, password } = req.body;

  // Vérification des données d'inscription
  if (username.length < 3) {
    return res.status(400).json({
      error: "Le nom d'utilisateur doit comporter au moins 3 caractères.",
    });
  }
  if (!validateEmail(email)) {
    return res
      .status(400)
      .json({ error: "Veuillez entrer une adresse email valide." });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Le mot de passe doit comporter au moins 6 caractères." });
  }

  // Enregistrer l'utilisateur dans la base de données
  const newUser = new User({ username, email, password });
  newUser.save((err) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de l'inscription." });
    }

    // Configuration de nodemailer pour envoyer l'email de confirmation
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tonemail@gmail.com", // Remplace par ton adresse email
        pass: "tonmotdepasse", // Remplace par ton mot de passe
      },
    });

    const mailOptions = {
      from: "tonemail@gmail.com",
      to: email,
      subject: "Confirmation d'inscription",
      text: `Bonjour ${username},\n\nVotre inscription au Réseau Social des Jeux Olympiques 2024 a bien été prise en compte.\n\nMerci de nous rejoindre !\n\nCordialement,\nL'équipe JO 2024`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          error: "Erreur lors de l'envoi de l'email de confirmation.",
        });
      } else {
        res.status(200).json({
          message:
            "Inscription réussie. Un email de confirmation a été envoyé.",
        });
      }
    });
  });
});

// Route pour gérer la connexion
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Vérifier les identifiants de l'utilisateur
  User.findOne({ username, password }, (err, user) => {
    if (err) {
      console.error("Erreur du serveur :", err);
      return res.status(500).json({ error: "Erreur du serveur." });
    }
    if (!user) {
      return res.status(401).json({ error: "Identifiants incorrects." });
    }

    res.status(200).json({ message: "Connexion réussie" });
  });
});

// Fonction pour valider l'email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
