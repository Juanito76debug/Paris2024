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

  $(document).ready(function () {
    // Logique de soumission du formulaire de connexion
    $("#loginForm").on("submit", function (event) {
      event.preventDefault();
      const username = $("#loginUsername").val();
      const password = $("#loginPassword").val();

      $.ajax({
        url: "http://localhost:3000/api/login",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ username, password }),
        success: function (data) {
          if (data.error) {
            alert(data.error);
          } else {
            // Stocke les informations de l'utilisateur dans le stockage local
            localStorage.setItem("username", data.username);
            localStorage.setItem("email", data.email);
            localStorage.setItem("userType", data.userType); // Stocke le type d'utilisateur
            // Redirige vers la page de profil après une connexion réussie
            window.location.href = "profile.html";
          }
        },
        error: function (error) {
          console.error("Error:", error);
          alert("Une erreur s'est produite. Veuillez réessayer.");
        },
      });
    });
    $("#registerForm").on("submit", function (event) {
      event.preventDefault();
      const username = $("#registerUsername").val();
      const email = $("#registerEmail").val();
      const password = $("#registerPassword").val();

      $.ajax({
        url: "http://localhost:3000/api/register",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ username, email, password }),
        success: function (data) {
          if (data.error) {
            alert(data.error);
          } else {
            alert("Inscription réussie. Veuillez vous connecter.");
            // Redirige vers la page de connexion après une inscription réussie
            window.location.href = "index.html";
          }
        },
        error: function (error) {
          console.error("Error:", error);
          alert("Une erreur s'est produite. Veuillez réessayer.");
        },
      });
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
    const lastName = localStorage.getItem("lastName");
    const firstName = localStorage.getItem("firstName");
    const age = localStorage.getItem("age");
    const gender = localStorage.getItem("gender");
    const preferences = localStorage.getItem("preferences");
    const profilePhoto = localStorage.getItem("profilePhoto");
    const bio = localStorage.getItem("bio");

    if (username && email) {
      document.getElementById("username").textContent = username;
      document.getElementById("email").textContent = email;
      document.getElementById("lastName").textContent = lastName;
      document.getElementById("firstName").textContent = firstName;
      document.getElementById("age").textContent = age;
      document.getElementById("gender").textContent = gender;
      document.getElementById("preferences").textContent = preferences;
      document.getElementById("profilePhoto").src = profilePhoto;
      document.getElementById("bio").textContent = bio;

      // Pré-remplir le formulaire de modification avec les informations actuelles
      document.getElementById("editUsername").value = username;
      document.getElementById("editEmail").value = email;
      document.getElementById("editLastName").value = lastName;
      document.getElementById("editFirstName").value = firstName;
      document.getElementById("editAge").value = age;
      document.getElementById("editGender").value = gender;
      document.getElementById("editPreferences").value = preferences;
      document.getElementById("editProfilePhoto").value = profilePhoto;
      document.getElementById("editBio").value = bio;
    } else {
      // Redirige vers la page de connexion si les informations de l'utilisateur ne sont pas disponibles
      window.location.href = "login.html";
    }

    // Logique de soumission du formulaire de modification du profil
    document
      .getElementById("editProfileForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const updatedProfile = {
          username: document.getElementById("editUsername").value,
          email: document.getElementById("editEmail").value,
          lastName: document.getElementById("editLastName").value,
          firstName: document.getElementById("editFirstName").value,
          age: document.getElementById("editAge").value,
          gender: document.getElementById("editGender").value,
          preferences: document.getElementById("editPreferences").value,
          profilePhoto: document.getElementById("editProfilePhoto").value,
          bio: document.getElementById("editBio").value,
        };

        fetch("http://localhost:3000/api/updateProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfile),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            if (data.error) {
              alert(data.error);
            } else {
              // Mettre à jour les informations dans le stockage local
              localStorage.setItem("username", updatedProfile.username);
              localStorage.setItem("email", updatedProfile.email);
              localStorage.setItem("lastName", updatedProfile.lastName);
              localStorage.setItem("firstName", updatedProfile.firstName);
              localStorage.setItem("age", updatedProfile.age);
              localStorage.setItem("gender", updatedProfile.gender);
              localStorage.setItem("preferences", updatedProfile.preferences);
              localStorage.setItem("profilePhoto", updatedProfile.profilePhoto);
              localStorage.setItem("bio", updatedProfile.bio);

              // Mettre à jour l'affichage des informations du profil
              document.getElementById("username").textContent =
                updatedProfile.username;
              document.getElementById("email").textContent =
                updatedProfile.email;
              document.getElementById("lastName").textContent =
                updatedProfile.lastName;
              document.getElementById("firstName").textContent =
                updatedProfile.firstName;
              document.getElementById("age").textContent = updatedProfile.age;
              document.getElementById("gender").textContent =
                updatedProfile.gender;
              document.getElementById("preferences").textContent =
                updatedProfile.preferences;
              document.getElementById("profilePhoto").src =
                updatedProfile.profilePhoto;
              document.getElementById("bio").textContent = updatedProfile.bio;

              alert("Profil mis à jour avec succès !");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Une erreur s'est produite. Veuillez réessayer.");
          });
      });
    if (window.location.pathname.endsWith("member-profile.html")) {
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");
      const lastName = localStorage.getItem("lastName");
      const firstName = localStorage.getItem("firstName");
      const age = localStorage.getItem("age");
      const gender = localStorage.getItem("gender");
      const preferences = localStorage.getItem("preferences");
      const profilePhoto = localStorage.getItem("profilePhoto");
      const bio = localStorage.getItem("bio");

      if (username && email) {
        document.getElementById("username").textContent = username;
        document.getElementById("email").textContent = email;
        document.getElementById("lastName").textContent = lastName;
        document.getElementById("firstName").textContent = firstName;
        document.getElementById("age").textContent = age;
        document.getElementById("gender").textContent = gender;
        document.getElementById("preferences").textContent = preferences;
        document.getElementById("profilePhoto").src = profilePhoto;
        document.getElementById("bio").textContent = bio;

        // Pré-remplir le formulaire de modification avec les informations actuelles
        document.getElementById("editUsername").value = username;
        document.getElementById("editEmail").value = email;
        document.getElementById("editLastName").value = lastName;
        document.getElementById("editFirstName").value = firstName;
        document.getElementById("editAge").value = age;
        document.getElementById("editGender").value = gender;
        document.getElementById("editPreferences").value = preferences;
        document.getElementById("editProfilePhoto").value = profilePhoto;
        document.getElementById("editBio").value = bio;
      } else {
        // Redirige vers la page de connexion si les informations de l'utilisateur ne sont pas disponibles
        window.location.href = "login.html";
      }

      // Logique de soumission du formulaire de modification du profil
      document
        .getElementById("editProfileForm")
        .addEventListener("submit", function (event) {
          event.preventDefault();
          const updatedProfile = {
            username: document.getElementById("editUsername").value,
            email: document.getElementById("editEmail").value,
            lastName: document.getElementById("editLastName").value,
            firstName: document.getElementById("editFirstName").value,
            age: document.getElementById("editAge").value,
            gender: document.getElementById("editGender").value,
            preferences: document.getElementById("editPreferences").value,
            profilePhoto: document.getElementById("editProfilePhoto").value,
            bio: document.getElementById("editBio").value,
          };

          fetch("http://localhost:3000/api/updateProfile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProfile),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              if (data.error) {
                alert(data.error);
              } else {
                // Mettre à jour les informations dans le stockage local
                localStorage.setItem("username", updatedProfile.username);
                localStorage.setItem("email", updatedProfile.email);
                localStorage.setItem("lastName", updatedProfile.lastName);
                localStorage.setItem("firstName", updatedProfile.firstName);
                localStorage.setItem("age", updatedProfile.age);
                localStorage.setItem("gender", updatedProfile.gender);
                localStorage.setItem("preferences", updatedProfile.preferences);
                localStorage.setItem(
                  "profilePhoto",
                  updatedProfile.profilePhoto
                );
                localStorage.setItem("bio", updatedProfile.bio);

                // Mettre à jour l'affichage des informations du profil
                document.getElementById("username").textContent =
                  updatedProfile.username;
                document.getElementById("email").textContent =
                  updatedProfile.email;
                document.getElementById("lastName").textContent =
                  updatedProfile.lastName;
                document.getElementById("firstName").textContent =
                  updatedProfile.firstName;
                document.getElementById("age").textContent = updatedProfile.age;
                document.getElementById("gender").textContent =
                  updatedProfile.gender;
                document.getElementById("preferences").textContent =
                  updatedProfile.preferences;
                document.getElementById("profilePhoto").src =
                  updatedProfile.profilePhoto;
                document.getElementById("bio").textContent = updatedProfile.bio;

                alert("Profil mis à jour avec succès !");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              alert("Une erreur s'est produite. Veuillez réessayer.");
            });
        });
    }
    // Logique de soumission du formulaire de recherche
    document
      .getElementById("searchFriendForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const searchUsername = document.getElementById("searchUsername").value;

        fetch(`http://localhost:3000/api/user/${searchUsername}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            if (data.error) {
              alert(data.error);
            } else {
              document.getElementById("friendUsername").textContent =
                data.username;
              document.getElementById("friendEmail").textContent = data.email;
              document.getElementById("friendLastName").textContent =
                data.lastName;
              document.getElementById("friendFirstName").textContent =
                data.firstName;
              document.getElementById("friendAge").textContent = data.age;
              document.getElementById("friendGender").textContent = data.gender;
              document.getElementById("friendPreferences").textContent =
                data.preferences;
              document.getElementById("friendProfilePhoto").src =
                data.profilePhoto;
              document.getElementById("friendBio").textContent = data.bio;
              document.getElementById("friendProfile").style.display = "block";
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Une erreur s'est produite. Veuillez réessayer.");
          });
      });

    // Logique de soumission du formulaire de modification du profil d'un ami
    document
      .getElementById("editFriendProfileForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const updatedFriendProfile = {
          username: document.getElementById("friendUsername").value,
          email: document.getElementById("friendEmail").value,
          lastName: document.getElementById("friendLastName").value,
          firstName: document.getElementById("friendFirstName").value,
          age: document.getElementById("friendAge").value,
          gender: document.getElementById("friendGender").value,
          preferences: document.getElementById("friendPreferences").value,
          profilePhoto: document.getElementById("friendProfilePhoto").value,
          bio: document.getElementById("friendBio").value,
        };

        fetch("http://localhost:3000/api/updateFriendProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFriendProfile),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            if (data.error) {
              alert(data.error);
            } else {
              alert("Profil de l'utilisateur mis à jour avec succès !");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Une erreur s'est produite. Veuillez réessayer.");
          });
      });

    // Logique pour récupérer et afficher tous les profils
    fetch("http://localhost:3000/api/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const profilesList = document.getElementById("profilesList");
        data.forEach((user) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${user.username} - ${user.email}`;
          listItem.addEventListener("click", () => {
            document.getElementById("friendUsername").value = user.username;
            document.getElementById("friendEmail").value = user.email;
            document.getElementById("friendLastName").value = user.lastName;
            document.getElementById("friendFirstName").value = user.firstName;
            document.getElementById("friendAge").value = user.age;
            document.getElementById("friendGender").value = user.gender;
            document.getElementById("friendPreferences").value =
              user.preferences;
            document.getElementById("friendProfilePhoto").value =
              user.profilePhoto;
            document.getElementById("friendBio").value = user.bio;
            document.getElementById("friendProfile").style.display = "block";
          });
          profilesList.appendChild(listItem);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
      });
  }

  // Logique de suppression du profil
  document
    .getElementById("deleteProfileButton")
    .addEventListener("click", function () {
      if (confirm("Êtes-vous sûr de vouloir supprimer votre profil ?")) {
        fetch("http://localhost:3000/api/deleteProfile", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            if (data.error) {
              alert(data.error);
            } else {
              alert("Profil supprimé avec succès !");
              // Supprime les informations de l'utilisateur du stockage local
              localStorage.removeItem("username");
              localStorage.removeItem("email");
              localStorage.removeItem("lastName");
              localStorage.removeItem("firstName");
              localStorage.removeItem("age");
              localStorage.removeItem("gender");
              localStorage.removeItem("preferences");
              localStorage.removeItem("profilePhoto");
              localStorage.removeItem("bio");
              // Redirige vers la page de connexion après la suppression
              window.location.href = "login.html";
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Une erreur s'est produite. Veuillez réessayer.");
          });
      }
    });

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

  document
    .getElementById("deleteFriendProfileButton")
    .addEventListener("click", function () {
      const username = document.getElementById("friendUsername").value;
      if (confirm("Êtes-vous sûr de vouloir supprimer ce profil ?")) {
        fetch("http://localhost:3000/api/deleteFriendProfile", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            if (data.error) {
              alert(data.error);
            } else {
              alert("Profil supprimé avec succès !");
              // Cache le formulaire de modification du profil de l'ami
              document.getElementById("friendProfile").style.display = "none";
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Une erreur s'est produite. Veuillez réessayer.");
          });
      }
    });
  document
    .getElementById("deleteAllProfilesButton")
    .addEventListener("click", function () {
      if (confirm("Êtes-vous sûr de vouloir supprimer tous les profils ?")) {
        fetch("http://localhost:3000/api/deleteAllProfiles", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            if (data.error) {
              alert(data.error);
            } else {
              alert("Tous les profils ont été supprimés avec succès !");
              // Cache la liste des profils
              document.getElementById("profilesList").innerHTML = "";
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Une erreur s'est produite. Veuillez réessayer.");
          });
      }
    });

  // Logique de soumission du formulaire de mot de passe perdu
  if (window.location.pathname.endsWith("forgot-password.html")) {
    document
      .getElementById("forgotPasswordForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("forgotPasswordEmail").value;

        if (!validateEmail(email)) {
          document.getElementById("errorMessage").textContent =
            "Veuillez entrer une adresse email valide.";
          return;
        }

        fetch("http://localhost:3000/api/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
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
              document.getElementById("successMessage").textContent =
                "Un email de réinitialisation de mot de passe a été envoyé.";
              document.getElementById("forgotPasswordForm").reset();
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            document.getElementById("errorMessage").textContent =
              "Une erreur s'est produite. Veuillez réessayer.";
          });
      });
  }

  // Logique de soumission du formulaire de réinitialisation de mot de passe
  if (window.location.pathname.endsWith("reset-password.html")) {
    document
      .getElementById("resetPasswordForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const newPassword = document.getElementById("newPassword").value;
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        fetch("http://localhost:3000/api/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
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
              document.getElementById("successMessage").textContent =
                "Votre mot de passe a été réinitialisé avec succès.";
              document.getElementById("resetPasswordForm").reset();
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            document.getElementById("errorMessage").textContent =
              "Une erreur s'est produite. Veuillez réessayer.";
          });
      });
  }
};
