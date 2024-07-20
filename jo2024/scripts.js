window.onload = function () {
  // Fonction pour récupérer le type d'utilisateur (exemple simplifié)
  function getUserType() {
    // Remplace cette logique par la logique réelle pour déterminer le type d'utilisateur
    // Par exemple, tu peux récupérer cette information depuis le backend ou les cookies
    return localStorage.getItem("userType") || "visiteur"; // 'visiteur', 'membre' ou 'administrateur'
  }

  // Afficher ou masquer la section d'inscription et le bouton de déconnexion en fonction du type d'utilisateur
  const userType = getUserType();
  if (userType !== "visiteur") {
    document.getElementById("registerBox").style.display = "none";
    document.getElementById("logoutButton").style.display = "block"; // Affiche le bouton de déconnexion
  }

  // Rediriger les administrateurs et les membres depuis la page de connexion
  if (userType === "membre" || userType === "administrateur") {
    window.location.href = "profile.html"; // Redirige vers la page de profil ou une autre page
  }

  // Fonction pour récupérer le nombre de messages publiés
  function fetchMessageCount() {
    fetch("http://localhost:3000/api/messageCount")
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("messageNumber").textContent = data.count;
      })
      .catch((error) => console.error("Error fetching message count:", error));
  }

  // Fonction pour récupérer le nombre de membres connectés
  function fetchConnectedMembers() {
    fetch("http://localhost:3000/api/connectedMembers")
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

  // Logique de soumission du formulaire de connexion
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;

      fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            document.getElementById("errorMessage").textContent = data.error;
          } else {
            // Stocke les informations de l'utilisateur dans le stockage local
            localStorage.setItem("username", data.username);
            localStorage.setItem("email", data.email);
            localStorage.setItem("userType", data.userType); // Stocke le type d'utilisateur
            // Redirige vers la page de profil après une connexion réussie
            window.location.href = "profile.html";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          document.getElementById("errorMessage").textContent =
            "Une erreur s'est produite. Veuillez réessayer.";
        });
    });

  // Fonction pour valider l'email
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Logique pour afficher les informations du profil sur la page de profil
  if (window.location.pathname.endsWith("profile.html")) {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    if (username && email) {
      document.getElementById("username").textContent = username;
      document.getElementById("email").textContent = email;
    } else {
      // Redirige vers la page de connexion si les informations de l'utilisateur ne sont pas disponibles
      window.location.href = "login.html";
    }

    // Logique de soumission du formulaire de publication
    document
      .getElementById("postForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const postContent = document.getElementById("postContent").value;

        fetch("http://localhost:3000/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: postContent, username: username }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            // Affiche le nouveau message publié
            const postElement = document.createElement("div");
            postElement.textContent = data.content;
            document.getElementById("posts").appendChild(postElement);
            document.getElementById("postForm").reset();
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Une erreur s'est produite. Veuillez réessayer.");
          });
      });
  }

  // Logique de déconnexion
  document
    .getElementById("logoutButton")
    .addEventListener("click", function () {
      // Supprime les informations de l'utilisateur du stockage local
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("userType");

      // Redirige vers la page de connexion après la déconnexion
      window.location.href = "login.html";
    });
};
