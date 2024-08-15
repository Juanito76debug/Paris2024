import express from "express";
import path from "path";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

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

// Définition des modèles
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
  resetToken: String,
  status: { type: String, default: "Pending" },
  friends: [
    {
      friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, default: "Pending" },
    },
  ], // Ajoutez ce champ
});

const User = mongoose.model("User", userSchema);

const messageSchema = new mongoose.Schema({
  content: String,
  replies: [{ content: String, date: { type: Date, default: Date.now } }],
});

const Message = mongoose.model("Message", messageSchema);

// Route pour récupérer le nombre de messages
app.get("/api/messageCount", async (req, res) => {
  try {
    const count = await Message.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Erreur lors de la récupération du nombre de messages:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
const discussionSchema = new mongoose.Schema({
  title: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [
    {
      content: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now },
    },
  ],
});

const Discussion = mongoose.model("Discussion", discussionSchema);

// Route pour servir le fichier HTML de la page d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route pour servir le fichier HTML de la page d'inscription
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

// Route pour servir le fichier HTML de la page "À propos"
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "about.html"));
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
    console.error("Erreur lors de la récupération des profils:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.get("/api/getMessages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (err) {
    console.error("Erreur lors de la récupération des messages:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});

app.get("/api/confirmedFriends", async (req, res) => {
  try {
    const confirmedFriends = await User.find(
      { status: "Confirmé" },
      "username lastName firstName profilePhoto"
    );
    res.status(200).json(confirmedFriends);
  } catch (err) {
    console.error("Erreur lors de la récupération des amis confirmés:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.get("/api/adminFriends", async (req, res) => {
  try {
    const adminFriends = await User.find(
      { status: "Confirmé" },
      "username lastName firstName profilePhoto"
    );
    res.status(200).json(adminFriends);
  } catch (err) {
    console.error("Erreur lors de la récupération des amis confirmés:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.get("/api/friendFriends/:friendId", async (req, res) => {
  const { friendId } = req.params;

  try {
    const friend = await User.findById(friendId).populate(
      "friends",
      "username lastName firstName profilePhoto"
    );
    if (!friend) {
      return res.status(404).json({ error: "Ami non trouvé." });
    }

    const confirmedFriends = friend.friends.filter(
      (f) => f.status === "Confirmé"
    );
    res.status(200).json(confirmedFriends);
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des amis confirmés de l'ami:",
      err
    );
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.get("/api/memberFriends/:memberId", async (req, res) => {
  const { memberId } = req.params;

  try {
    const member = await User.findById(memberId).populate(
      "friends",
      "username lastName firstName profilePhoto"
    );
    if (!member) {
      return res.status(404).json({ error: "Membre non trouvé." });
    }

    const confirmedFriends = member.friends.filter(
      (f) => f.status === "Confirmé"
    );
    res.status(200).json(confirmedFriends);
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des amis confirmés du membre:",
      err
    );
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.get("/api/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des informations de l'utilisateur:",
      err
    );
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.get("/api/getDiscussions", async (req, res) => {
  try {
    const discussions = await Discussion.find().populate(
      "participants",
      "username firstName lastName"
    );
    res.status(200).json(discussions);
  } catch (err) {
    console.error("Erreur lors de la récupération des discussions:", err);
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Utilisateur déjà enregistré." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
      text: `Bonjour ${username},\n\nVotre inscription a bien été prise en compte.\n\nMerci de nous rejoindre !\n\nCordialement,\nL'équipe`,
    };

    await transporter.sendMail(mailOptions);

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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email non trouvé." });
    }

    const newPassword = Math.random().toString(36).substr(2, 8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

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
      text: `Bonjour,\n\nVotre mot de passe a été réinitialisé. Voici vos nouveaux identifiants de connexion :\n\nNom d'utilisateur : ${user.username}\nNouveau mot de passe : ${newPassword}\n\nMerci de vous connecter et de changer votre mot de passe dès que possible.\n\nCordialement,\nL'équipe`,
    };

    await transporter.sendMail(mailOptions);

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
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Identifiants incorrects." });
    }

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

// Route pour mettre à jour le profil utilisateur
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

// Route pour mettre à jour le profil d'un ami
app.post("/api/updateUserProfile", async (req, res) => {
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
app.post("/api/recommendFriend", async (req, res) => {
  const { friendId, recommenderId } = req.body;

  try {
    const friend = await User.findById(friendId);
    const recommender = await User.findById(recommenderId);

    if (!friend || !recommender) {
      return res
        .status(404)
        .json({ error: "Ami ou recommandateur non trouvé." });
    }

    // Ajouter l'ami recommandé à la liste d'amis du recommandateur avec le statut "Recommandé"
    recommender.friends.push({ friendId: friend._id, status: "Recommandé" });
    await recommender.save();

    // Envoyer une notification par email à l'administrateur
    const adminEmail = process.env.ADMIN_EMAIL; // Assure-toi que l'email de l'administrateur est défini dans les variables d'environnement

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: "Nouvelle recommandation d'ami",
      text: `Bonjour,\n\n${recommender.username} a recommandé ${friend.username} comme ami.\n\nCordialement,\nL'équipe`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Ami recommandé avec succès et notification envoyée." });
  } catch (err) {
    console.error("Erreur lors de la recommandation de l'ami:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});

// Route pour supprimer le profil utilisateur
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

// Route pour supprimer le profil d'un ami
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

// Route pour supprimer tous les profils
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

// Route pour publier un message
app.post("/api/postMessage", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Le contenu du message est requis." });
  }

  try {
    const newMessage = new Message({ content });
    await newMessage.save();

    res.status(200).json({ message: "Message publié avec succès." });
  } catch (err) {
    console.error("Erreur lors de la publication du message:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});

// Route pour publier une réponse à un message
app.post("/api/replyMessage", async (req, res) => {
  const { messageId, content } = req.body;

  if (!messageId || !content) {
    return res.status(400).json({
      error: "L'ID du message et le contenu de la réponse sont requis.",
    });
  }

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message non trouvé." });
    }

    message.replies.push({ content });
    await message.save();

    res.status(200).json({ message: "Réponse publiée avec succès." });
  } catch (err) {
    console.error("Erreur lors de la publication de la réponse:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});

// Route pour publier une réponse à un message sur le profil d'un ami
app.post("/api/replyFriendMessage", async (req, res) => {
  const { messageId, content } = req.body;

  if (!messageId || !content) {
    return res.status(400).json({
      error: "L'ID du message et le contenu de la réponse sont requis.",
    });
  }

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message non trouvé." });
    }

    message.replies.push({ content });
    await message.save();

    res.status(200).json({ message: "Réponse publiée avec succès." });
  } catch (err) {
    console.error("Erreur lors de la publication de la réponse:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.post("/api/adminReplyMessage", async (req, res) => {
  const { messageId, content } = req.body;

  if (!messageId || !content) {
    return res.status(400).json({
      error: "L'ID du message et le contenu de la réponse sont requis.",
    });
  }

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message non trouvé." });
    }

    message.replies.push({ content });
    await message.save();

    res.status(200).json({ message: "Réponse publiée avec succès." });
  } catch (err) {
    console.error("Erreur lors de la publication de la réponse:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.post("/api/addFriend/:adminId/:memberId", async (req, res) => {
  const { adminId, memberId } = req.params;

  try {
    const admin = await User.findById(adminId);
    const member = await User.findById(memberId);

    if (!admin || !member) {
      return res
        .status(404)
        .json({ error: "Administrateur ou membre non trouvé." });
    }

    // Ajouter l'administrateur à la liste d'amis du membre avec le statut "Confirmé"
    member.friends.push({ friendId: admin._id, status: "Confirmé" });
    await member.save();

    // Ajouter le membre à la liste d'amis de l'administrateur avec le statut "Confirmé"
    admin.friends.push({ friendId: member._id, status: "Confirmé" });
    await admin.save();

    res.status(200).json({ message: "Ami ajouté avec succès." });
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'ami:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.post("/api/searchUsers", async (req, res) => {
  const { username, firstName, lastName } = req.body;

  try {
    const query = {};
    if (username) query.username = new RegExp(username, "i");
    if (firstName) query.firstName = new RegExp(firstName, "i");
    if (lastName) query.lastName = new RegExp(lastName, "i");

    const users = await User.find(query);
    res.status(200).json(users);
  } catch (err) {
    console.error("Erreur lors de la recherche d'utilisateurs:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.post("/api/addFriend", async (req, res) => {
  const { adminId, userId } = req.body;

  try {
    const admin = await User.findById(adminId);
    const user = await User.findById(userId);

    if (!admin || !user) {
      return res
        .status(404)
        .json({ error: "Administrateur ou utilisateur non trouvé." });
    }

    // Ajouter l'utilisateur à la liste d'amis de l'administrateur avec le statut "Confirmé"
    admin.friends.push({ friendId: user._id, status: "Confirmé" });
    await admin.save();

    res
      .status(200)
      .json({ message: "Utilisateur ajouté à la liste d'amis avec succès." });
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'ami:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.post("/api/sendFriendRequest", async (req, res) => {
  const { requesterId, userId } = req.body;

  try {
    const requester = await User.findById(requesterId);
    const user = await User.findById(userId);

    if (!requester || !user) {
      return res
        .status(404)
        .json({ error: "Membre demandeur ou utilisateur non trouvé." });
    }

    // Ajouter l'utilisateur à la liste d'amis du membre demandeur avec le statut "invitation en cours"
    requester.friends.push({
      friendId: user._id,
      status: "invitation en cours",
    });
    await requester.save();

    // Ajouter le membre demandeur à la liste d'amis de l'administrateur avec le statut "en attente de confirmation"
    user.friends.push({
      friendId: requester._id,
      status: "en attente de confirmation",
    });
    await user.save();

    // Envoyer une notification par email à l'administrateur
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Nouvelle invitation d'ami",
      text: `Bonjour ${user.username},\n\nVous avez reçu une nouvelle invitation d'ami de la part de ${requester.username}.\n\nCordialement,\nL'équipe`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Invitation d'ami envoyée avec succès et notification envoyée.",
    });
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'invitation d'ami:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.post("/api/createDiscussion", async (req, res) => {
  const { title, participants } = req.body;

  if (!title || !participants || participants.length === 0) {
    return res
      .status(400)
      .json({ error: "Le titre et les participants sont requis." });
  }

  try {
    const newDiscussion = new Discussion({ title, participants });
    await newDiscussion.save();

    res.status(200).json({ message: "Discussion créée avec succès." });
  } catch (err) {
    console.error("Erreur lors de la création de la discussion:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.post("/api/postMessageInDiscussion", async (req, res) => {
  const { discussionId, content, senderId } = req.body;

  if (!discussionId || !content || !senderId) {
    return res.status(400).json({
      error:
        "L'ID de la discussion, le contenu du message et l'ID de l'expéditeur sont requis.",
    });
  }

  try {
    // Vérifiez que l'utilisateur est un administrateur (ajoutez votre logique de vérification ici)
    const admin = await User.findById(senderId);
    if (!admin || admin.status !== "Admin") {
      return res
        .status(403)
        .json({ error: "Vous n'êtes pas autorisé à publier des messages." });
    }

    // Trouvez la discussion
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ error: "Discussion non trouvée." });
    }

    // Ajoutez le message à la discussion
    discussion.messages.push({ content, sender: senderId });
    await discussion.save();

    res
      .status(200)
      .json({ message: "Message publié avec succès dans la discussion." });
  } catch (err) {
    console.error(
      "Erreur lors de la publication du message dans la discussion:",
      err
    );
    res.status(500).json({ error: "Erreur du serveur." });
  }
});

app.delete("/api/removeFriend/:adminId/:friendId", async (req, res) => {
  const { adminId, friendId } = req.params;

  try {
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Administrateur non trouvé." });
    }

    admin.friends = admin.friends.filter(
      (friend) => friend.toString() !== friendId
    );
    await admin.save();

    res.status(200).json({ message: "Ami supprimé avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'ami:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.delete("/api/removeFriend/:memberId/:friendId", async (req, res) => {
  const { memberId, friendId } = req.params;

  try {
    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: "Membre non trouvé." });
    }

    member.friends = member.friends.filter(
      (friend) => friend.toString() !== friendId
    );
    await member.save();

    res.status(200).json({ message: "Ami supprimé avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'ami:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.delete("/api/ignoreFriendRequest/:adminId/:memberId", async (req, res) => {
  const { adminId, memberId } = req.params;

  try {
    const admin = await User.findById(adminId);
    const member = await User.findById(memberId);

    if (!admin || !member) {
      return res
        .status(404)
        .json({ error: "Administrateur ou membre non trouvé." });
    }

    // Supprimer le membre de la liste d'amis de l'administrateur
    admin.friends = admin.friends.filter(
      (friend) => friend.friendId.toString() !== memberId
    );
    await admin.save();

    // Supprimer l'administrateur de la liste d'amis du membre demandeur
    member.friends = member.friends.filter(
      (friend) => friend.friendId.toString() !== adminId
    );
    await member.save();

    res.status(200).json({ message: "Demande d'ami ignorée avec succès." });
  } catch (err) {
    console.error("Erreur lors de l'ignorance de la demande d'ami:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.delete("/api/deleteDiscussion/:discussionId", async (req, res) => {
  const { discussionId } = req.params;

  try {
    const discussion = await Discussion.findByIdAndDelete(discussionId);
    if (!discussion) {
      return res.status(404).json({ error: "Discussion non trouvée." });
    }

    res.status(200).json({ message: "Discussion supprimée avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression de la discussion:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});
app.delete("/api/deleteDiscussionMessage/:messageId", async (req, res) => {
  const { messageId } = req.params;

  try {
    const discussion = await Discussion.findOne({ "messages._id": messageId });
    if (!discussion) {
      return res.status(404).json({ error: "Message non trouvé." });
    }

    discussion.messages.id(messageId).remove();
    await discussion.save();

    res.status(200).json({ message: "Message supprimé avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression du message:", err);
    res.status(500).json({ error: "Erreur du serveur." });
  }
});


app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
