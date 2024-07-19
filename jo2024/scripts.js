window.onload = function () {
  // Fonction pour récupérer le type d'utilisateur (exemple simplifié)
  function getUserType() {
    // Remplace cette logique par la logique réelle pour déterminer le type d'utilisateur
    // Par exemple, tu peux récupérer cette information depuis le backend ou les cookies
    return "visiteur"; // 'visiteur', 'membre' ou 'administrateur'
  }

  // Afficher ou masquer la section d'inscription en fonction du type d'utilisateur
  const userType = getUserType();
  if (userType !== "visiteur") {
    document.getElementById("registerBox").style.display = "none";
  }

  // Fonction pour récupérer le nombre de messages publiés
  function fetchMessageCount() {
    fetch("/api/messageCount")
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("messageNumber").textContent = data.count;
      })
      .catch((error) => console.error("Error fetching message count:", error));
  }

  // Fonction pour récupérer le nombre de membres connectés
  function fetchConnectedMembers() {
    fetch("/api/connectedMembers")
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("memberNumber").textContent = data.count;
      })
      .catch((error) =>
        console.error("Error fetching connected members:", error)
      );
  }

  // Appelle les fonctions pour récupérer les données au chargement de la page
  fetchMessageCount();
  fetchConnectedMembers();

  // Met à jour les données toutes les 10 secondes
  setInterval(fetchMessageCount, 10000);
  setInterval(fetchConnectedMembers, 10000);

  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;
      alert(`Connexion avec le nom d'utilisateur : ${username}`);
      // Ajoute ici la logique de connexion
    });

  document
    .getElementById("registerForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("registerUsername").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;

      // Vérification des données d'inscription
      if (username.length < 3) {
        alert("Le nom d'utilisateur doit comporter au moins 3 caractères.");
        return;
      }
      if (!validateEmail(email)) {
        alert("Veuillez entrer une adresse email valide.");
        return;
      }
      if (password.length < 6) {
        alert("Le mot de passe doit comporter au moins 6 caractères.");
        return;
      }

      alert(
        `Inscription avec le nom d'utilisateur : ${username} et l'email : ${email}`
      );
      // Ajoute ici la logique d'inscription
    });

  // Fonction pour valider l'email
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
};
