import express from "express";
import path from "path";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt"; // Assure-toi d'avoir installé bcrypt

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(path.join("C:/Users/juan_/Documents/Paris2024/jo2024")));
app.use(bodyParser.json());

// Connexion à la base de données MongoDB
mongoose
  .connect("mongodb://localhost:27017/jo2024")
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err));

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
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Tentative d'inscription pour:", username, email);

  // Vérifications des données
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Email invalide." });
  }

  try {
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Utilisateur déjà enregistré." });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Enregistrer l'utilisateur dans la base de données
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    console.log("Utilisateur enregistré dans la base de données");

    // Configuration de nodemailer pour envoyer l'email de confirmation
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmation d'inscription",
      text: `Bonjour ${username},\n\nVotre inscription au Réseau Social des Jeux Olympiques 2024 a bien été prise en compte.\n\nMerci de nous rejoindre !\n\nCordialement,\nL'équipe JO 2024`,
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);
    console.log("Email de confirmation envoyé");

    res.status(200).json({
      message: "Inscription réussie. Un email de confirmation a été envoyé.",
    });
  } catch (err) {
    console.error("Erreur lors de l'inscription:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de l'inscription: " + err.message });
  }
});

// Route pour gérer la connexion
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifier les identifiants de l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Identifiants incorrects." });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Identifiants incorrects." });
    }

    res.status(200).json({
      message: "Connexion réussie",
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error("Erreur lors de la connexion:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});

// Fonction pour valider l'email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
