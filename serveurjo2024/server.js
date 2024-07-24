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
  lastName: String,
  firstName: String,
  gender: String,
  bio: String,
  preferences: String,
  profilePhoto: String,
  resetToken: String, // Ajoute ce champ pour le token de réinitialisation
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
app.get("/api/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
      gender: user.gender,
      age: user.age,
      preferences: user.preferences,
      profilePhoto: user.profilePhoto,
      bio: user.bio,
    });
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des informations de l'utilisateur:",
      err
    );
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});

// Route pour gérer l'inscription
app.post("/api/register", async (req, res) => {
  const {
    username,
    email,
    password,
    lastName,
    firstName,
    gender,
    bio,
    preferences,
    profilePhoto,
  } = req.body;
  console.log("Tentative d'inscription pour:", username, email);

  // Vérifications des données
  if (
    !username ||
    !email ||
    !password ||
    !lastName ||
    !firstName ||
    !gender ||
    !bio ||
    !preferences ||
    !profilePhoto
  ) {
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
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      lastName,
      firstName,
      gender,
      bio,
      preferences,
      profilePhoto,
    });
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

// Route pour gérer la demande de mot de passe perdu
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Vérifie si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email non trouvé." });
    }

    // Génère un nouveau mot de passe (exemple simplifié)
    const newPassword = Math.random().toString(36).substr(2, 8);

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = hashedPassword;
    await user.save();

    // Configuration de nodemailer pour envoyer l'email avec les nouveaux identifiants
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
      subject: "Nouveaux identifiants de connexion",
      text: `Bonjour,\n\nVotre mot de passe a été réinitialisé. Voici vos nouveaux identifiants de connexion :\n\nNom d'utilisateur : ${user.username}\nNouveau mot de passe : ${newPassword}\n\nMerci de vous connecter et de changer votre mot de passe dès que possible.\n\nCordialement,\nL'équipe JO 2024`,
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);
    console.log("Email avec les nouveaux identifiants envoyé");

    res.status(200).json({
      message:
        "Un email avec vos nouveaux identifiants de connexion a été envoyé.",
    });
  } catch (err) {
    console.error("Erreur lors de la demande de mot de passe perdu:", err);
    res.status(500).json({ error: "Erreur du serveur." });
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
      lastName: user.lastName,
      firstName: user.firstName,
      gender: user.gender,
      bio: user.bio,
      preferences: user.preferences,
      profilePhoto: user.profilePhoto,
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
app.post("/api/updateProfile", async (req, res) => {
  const {
    username,
    email,
    lastName,
    firstName,
    age,
    gender,
    preferences,
    profilePhoto,
    bio,
  } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }
    user.username = username;
    user.lastName = lastName;
    user.firstName = firstName;
    user.age = age;
    user.gender = gender;
    user.preferences = preferences;
    user.profilePhoto = profilePhoto;
    user.bio = bio;

    await user.save();

    res.status(200).json({ message: "Profil mis à jour avec succès." });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du profil:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.post("/api/updateFriendProfile", async (req, res) => {
  const {
    username,
    email,
    lastName,
    firstName,
    age,
    gender,
    preferences,
    profilePhoto,
    bio,
  } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    user.email = email;
    user.lastName = lastName;
    user.firstName = firstName;
    user.age = age;
    user.gender = gender;
    user.preferences = preferences;
    user.profilePhoto = profilePhoto;
    user.bio = bio;

    await user.save();

    res
      .status(200)
      .json({ message: "Profil de l'utilisateur mis à jour avec succès." });
  } catch (err) {
    console.error(
      "Erreur lors de la mise à jour du profil de l'utilisateur:",
      err
    );
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.delete("/api/deleteProfile", async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOneAndDelete({ username });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json({ message: "Profil supprimé avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression du profil:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.delete("/api/deleteFriendProfile", async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOneAndDelete({ username });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json({ message: "Profil supprimé avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression du profil:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.delete("/api/deleteAllProfiles", async (req, res) => {
  try {
    await User.deleteMany({});
    res
      .status(200)
      .json({ message: "Tous les profils ont été supprimés avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression de tous les profils:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
