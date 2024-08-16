window.onload = function () {
  // Fonction pour récupérer le type d'utilisateur (exemple simplifié)
  function getUserType() {
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

  if (userType === "administrateur") {
    document.querySelectorAll(".message-item").forEach((item) => {
      item.querySelector(".deleteButton").style.display = "block";
    });
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
            localStorage.setItem("lastName", data.lastName);
            localStorage.setItem("firstName", data.firstName);
            localStorage.setItem("age", data.age);
            localStorage.setItem("gender", data.gender);
            localStorage.setItem("preferences", data.preferences);
            localStorage.setItem("profilePhoto", data.profilePhoto);
            localStorage.setItem("bio", data.bio); // Stocke le type d'utilisateur
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
            localStorage.setItem("lastName", data.lastName);
            localStorage.setItem("firstName", data.firstName);
            localStorage.setItem("age", data.age);
            localStorage.setItem("gender", data.gender);
            localStorage.setItem("preferences", data.preferences);
            localStorage.setItem("profilePhoto", data.profilePhoto);
            localStorage.setItem("bio", data.bio); // Stocke le type d'utilisateur
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
    const re = /^[^\s@]+@[^\s@]+$/;
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
    document.addEventListener("DOMContentLoaded", function () {
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

      function updateProfileDisplay(profile) {
        document.getElementById("username").textContent = profile.username;
        document.getElementById("email").textContent = profile.email;
        document.getElementById("lastName").textContent = profile.lastName;
        document.getElementById("firstName").textContent = profile.firstName;
        document.getElementById("age").textContent = profile.age;
        document.getElementById("gender").textContent = profile.gender;
        document.getElementById("preferences").textContent =
          profile.preferences;
        document.getElementById("profilePhoto").src = profile.profilePhoto;
        document.getElementById("bio").textContent = profile.bio;
      }
    });
  }

  // Logique de soumission du formulaire de recherche
  document.addEventListener("DOMContentLoaded", function () {
    // Logique de soumission du formulaire de recherche d'utilisateur
    document
      .getElementById("searchUserForm")
      .addEventListener("submit", async function (event) {
        event.preventDefault();
        const username = document.getElementById("searchUsername").value;
        const firstName = document.getElementById("searchFirstName").value;
        const lastName = document.getElementById("searchLastName").value;

        try {
          const response = await fetch(
            "http://localhost:3000/api/searchUsers",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, firstName, lastName }),
            }
          );
          const results = await response.json();

          const searchResults = document.getElementById("searchResults");
          searchResults.innerHTML = ""; // Vider les résultats avant de les remplir

          if (results.length === 0) {
            searchResults.textContent = "Aucun utilisateur trouvé.";
          } else {
            results.forEach((user) => {
              const userItem = document.createElement("div");
              userItem.innerHTML = `
              <p>Pseudonyme : ${user.username}</p>
              <p>Nom : ${user.lastName}</p>
              <p>Prénom : ${user.firstName}</p>
              <p>Email : ${user.email}</p>
              <p>Genre : ${user.gender}</p>
              <p>Âge : ${user.age}</p>
              <p>Préférences : ${user.preferences}</p>
              <p>Présentation : ${user.bio}</p>
              <img src="${user.profilePhoto}" alt="Photo de profil" class="profile-photo" />
            `;
              searchResults.appendChild(userItem);
            });
          }
        } catch (error) {
          console.error("Erreur lors de la recherche d'utilisateur:", error);
          alert("Une erreur s'est produite. Veuillez réessayer.");
        }
      });
  });

  // Logique de soumission du formulaire de modification du profil d'un ami
  document
    .getElementById("editFriendProfileForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const updatedFriendProfile = {
        username: document.getElementById("editFriendUsername").value,
        email: document.getElementById("editFriendEmail").value,
        lastName: document.getElementById("editFriendLastName").value,
        firstName: document.getElementById("editFriendFirstName").value,
        age: document.getElementById("editFriendAge").value,
        gender: document.getElementById("editFriendGender").value,
        preferences: document.getElementById("editFriendPreferences").value,
        profilePhoto: document.getElementById("editFriendProfilePhoto").value,
        bio: document.getElementById("editFriendBio").value,
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
            // Mettre à jour l'affichage des informations du profil de l'ami
            document.getElementById("friendUsername").textContent =
              updatedFriendProfile.username;
            document.getElementById("friendEmail").textContent =
              updatedFriendProfile.email;
            document.getElementById("friendLastName").textContent =
              updatedFriendProfile.lastName;
            document.getElementById("friendFirstName").textContent =
              updatedFriendProfile.firstName;
            document.getElementById("friendAge").textContent =
              updatedFriendProfile.age;
            document.getElementById("friendGender").textContent =
              updatedFriendProfile.gender;
            document.getElementById("friendPreferences").textContent =
              updatedFriendProfile.preferences;
            document.getElementById("friendProfilePhoto").src =
              updatedFriendProfile.profilePhoto;
            document.getElementById("friendBio").textContent =
              updatedFriendProfile.bio;

            alert("Profil de l'ami mis à jour avec succès !");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Une erreur s'est produite. Veuillez réessayer.");
        });
    });
  document
    .getElementById("editUserProfileForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const updatedUserProfile = {
        username: document.getElementById("editUserUsername").value,
        email: document.getElementById("editUserEmail").value,
        lastName: document.getElementById("editUserLastName").value,
        firstName: document.getElementById("editUserFirstName").value,
        age: document.getElementById("editUserAge").value,
        gender: document.getElementById("editUserGender").value,
        preferences: document.getElementById("editUserPreferences").value,
        profilePhoto: document.getElementById("editUserProfilePhoto").value,
        bio: document.getElementById("editUserBio").value,
      };

      fetch("http://localhost:3000/api/updateUserProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserProfile),
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
            // Mettre à jour l'affichage des informations du profil de l'utilisateur
            document.getElementById("userUsername").textContent =
              updatedUserProfile.username;
            document.getElementById("userEmail").textContent =
              updatedUserProfile.email;
            document.getElementById("userLastName").textContent =
              updatedUserProfile.lastName;
            document.getElementById("userFirstName").textContent =
              updatedUserProfile.firstName;
            document.getElementById("userAge").textContent =
              updatedUserProfile.age;
            document.getElementById("userGender").textContent =
              updatedUserProfile.gender;
            document.getElementById("userPreferences").textContent =
              updatedUserProfile.preferences;
            document.getElementById("userProfilePhoto").src =
              updatedUserProfile.profilePhoto;
            document.getElementById("userBio").textContent =
              updatedUserProfile.bio;

            alert("Profil de l'utilisateur mis à jour avec succès !");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Une erreur s'est produite. Veuillez réessayer.");
        });
    });

  // Logique pour récupérer et afficher tous les profils

  function fetchAllProfiles() {
    fetch("http://localhost:3000/api/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const profilesList = document.getElementById("profilesList");
        profilesList.innerHTML = ""; // Vider la liste avant de la remplir
        data.forEach((user) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${user.username} - ${user.email}`;
          listItem.addEventListener("click", () => {
            document.getElementById("friendUsername").textContent =
              user.username;
            document.getElementById("friendEmail").textContent = user.email;
            document.getElementById("friendLastName").textContent =
              user.lastName;
            document.getElementById("friendFirstName").textContent =
              user.firstName;
            document.getElementById("friendAge").textContent = user.age;
            document.getElementById("friendGender").textContent = user.gender;
            document.getElementById("friendPreferences").textContent =
              user.preferences;
            document.getElementById("friendProfilePhoto").src =
              user.profilePhoto;
            document.getElementById("friendBio").textContent = user.bio;
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

  // Appeler la fonction pour récupérer et afficher tous les profils au chargement de la page
  fetchAllProfiles();

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
      localStorage.removeItem("lastName");
      localStorage.removeItem("firstName");
      localStorage.removeItem("age");
      localStorage.removeItem("gender");
      localStorage.removeItem("preferences");
      localStorage.removeItem("profilePhoto");
      localStorage.removeItem("bio");
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

  // Logique de soumission du formulaire de publication de message
  document.addEventListener("DOMContentLoaded", function () {
    // Soumettre le formulaire de publication de message pour l'utilisateur
    document
      .getElementById("postForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const postContent = document.getElementById("postContent").value;

        fetch("http://localhost:3000/api/postMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: postContent }),
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
              // Ajouter le message à la liste des messages
              const messagesList = document.getElementById("messagesList");
              const messageItem = document.createElement("div");
              messageItem.textContent = postContent;
              messageItem.dataset.messageId = data.messageId; // Associer l'ID du message
              messagesList.appendChild(messageItem);

              // Réinitialiser le formulaire
              document.getElementById("postForm").reset();
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Une erreur s'est produite. Veuillez réessayer.");
          });
      });

    // Logique de soumission du formulaire de réponse
    $(document).ready(function () {
      $("#submitReply").click(function (event) {
        event.preventDefault();
        const replyContent = $("#replyContent").val();
        const messageId = $("#replyForm").data("message-id");

        $.ajax({
          type: "POST",
          url: "http://localhost:3000/api/replyMessage",
          data: JSON.stringify({ messageId, content: replyContent }),
          contentType: "application/json",
          success: function (data) {
            if (data.error) {
              alert(data.error);
            } else {
              const replyItem = $('<div class="reply-item"></div>').text(
                replyContent
              );
              $(`[data-message-id="${messageId}"]`).append(replyItem);
              $("#replyForm").hide();
              $("#replyForm")[0].reset();
            }
          },
          error: function (error) {
            console.error("Error:", error);
            alert("Une erreur s'est produite. Veuillez réessayer.");
          },
        });
      });
    });

    // Logique de soumission du formulaire de publication de message sur le profil de l'ami
    document
      .getElementById("friendPostForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const friendPostContentElement =
          document.getElementById("friendPostContent");
        if (friendPostContentElement) {
          const friendPostContent = friendPostContentElement.value;

          fetch("http://localhost:3000/api/postMessageToFriend", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: friendPostContent }),
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
                const friendMessagesList =
                  document.getElementById("friendMessagesList");
                const friendMessageItem = document.createElement("div");
                friendMessageItem.textContent = friendPostContent;
                friendMessageItem.dataset.messageId = data.messageId;
                friendMessagesList.appendChild(friendMessageItem);

                document.getElementById("friendPostForm").reset();
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              alert("Une erreur s'est produite. Veuillez réessayer.");
            });
        }
      });

    // Logique de soumission du formulaire de réponse sur le profil de l'ami
    if (event.target.classList.contains("replyForm")) {
      event.preventDefault();
      const replyContent = event.target.querySelector(".replyContent").value;
      const messageId = event.target.closest("div").dataset.messageId;

      fetch("http://localhost:3000/api/replyFriendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId, content: replyContent }),
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
            // Ajouter la réponse sous le message de l'ami
            const replyItem = document.createElement("div");
            replyItem.textContent = replyContent;
            event.target.closest("div").appendChild(replyItem);

            // Réinitialiser le formulaire de réponse
            event.target.reset();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Une erreur s'est produite. Veuillez réessayer.");
        });
    }
  });
  const friendMessagesList = document.getElementById("friendMessagesList");

  // Gestionnaire de soumission du formulaire de publication de message sur le profil d'un ami

  document
    .getElementById("friendPostForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const friendPostContent =
        document.getElementById("friendPostContent").value;
      document.addEventListener("submit", function (event) {
        if (event.target.classList.contains("replyForm")) {
          event.preventDefault();
          const replyContent =
            event.target.querySelector(".replyContent").value;
          const messageId = event.target.closest("div").dataset.messageId;

          fetch("http://localhost:3000/api/replyFriendMessage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ messageId, content: replyContent }),
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
                // Ajouter la réponse sous le message de l'ami
                const replyItem = document.createElement("div");
                replyItem.textContent = replyContent;
                event.target.closest("div").appendChild(replyItem);

                // Réinitialiser le formulaire de réponse
                event.target.reset();
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              alert("Une erreur s'est produite. Veuillez réessayer.");
            });
        }
      });
    });
  document
    .getElementById("adminReplyForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const replyContent = document.getElementById("adminReplyContent").value;
      const messageId =
        document.querySelector(".message-item").dataset.messageId;

      fetch("http://localhost:3000/api/adminReplyMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId, content: replyContent }),
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
            // Ajouter la réponse sous le message
            const replyItem = document.createElement("div");
            replyItem.textContent = replyContent;
            document.querySelector(".message-item").appendChild(replyItem);

            // Réinitialiser le formulaire de réponse
            document.getElementById("adminReplyForm").reset();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Une erreur s'est produite. Veuillez réessayer.");
        });
    });
  $(document).ready(function () {
    $(document).on("click", ".deleteButton", function () {
      const messageId = $(this).closest(".message-item").data("message-id");

      $.ajax({
        type: "DELETE",
        url: "http://localhost:3000/api/deleteMessage",
        data: JSON.stringify({ messageId }),
        contentType: "application/json",
        success: function (data) {
          if (data.error) {
            alert(data.error);
          } else {
            $(`[data-message-id="${messageId}"]`).remove();
            alert("Message supprimé avec succès !");
          }
        },
        error: function (error) {
          console.error("Error:", error);
          alert("Une erreur s'est produite. Veuillez réessayer.");
        },
      });
    });
  });
  document.addEventListener("DOMContentLoaded", async function () {
    // Fonction pour récupérer et afficher les amis confirmés dans la liste de sélection
    async function fetchConfirmedFriends() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/confirmedFriends"
        );
        const friends = await response.json();
        const confirmedFriendsSelect =
          document.getElementById("confirmedFriends");
        confirmedFriendsSelect.innerHTML = ""; // Vider la liste avant de la remplir

        friends.forEach((friend) => {
          const option = document.createElement("option");
          option.value = friend._id;
          option.textContent = `${friend.username} (${friend.firstName} ${friend.lastName})`;
          confirmedFriendsSelect.appendChild(option);
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des amis confirmés:",
          error
        );
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
    }

    // Appeler la fonction pour récupérer et afficher les amis confirmés au chargement de la page
    document.addEventListener("DOMContentLoaded", async function () {
      // Fonction pour récupérer et afficher les amis confirmés dans la liste de sélection
      async function fetchConfirmedFriends() {
        try {
          const response = await fetch(
            "http://localhost:3000/api/confirmedFriends"
          );
          const friends = await response.json();
          const selectFriends = document.getElementById("selectFriends");
          selectFriends.innerHTML = ""; // Vider la liste avant de la remplir

          friends.forEach((friend) => {
            const option = document.createElement("option");
            option.value = friend._id;
            option.textContent = `${friend.username} (${friend.firstName} ${friend.lastName})`;
            selectFriends.appendChild(option);
          });
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des amis confirmés:",
            error
          );
          alert("Une erreur s'est produite. Veuillez réessayer.");
        }
      }

      // Appeler la fonction pour récupérer et afficher les amis confirmés au chargement de la page
      fetchConfirmedFriends();

      // Logique de soumission du formulaire de création de discussion
      document
        .getElementById("createDiscussionForm")
        .addEventListener("submit", async function (event) {
          event.preventDefault();
          const title = document.getElementById("discussionTitle").value;
          const selectedFriends = Array.from(
            document.getElementById("selectFriends").selectedOptions
          ).map((option) => option.value);

          try {
            const response = await fetch(
              "http://localhost:3000/api/createDiscussion",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, participants: selectedFriends }),
              }
            );
            const result = await response.json();

            if (result.error) {
              alert(result.error);
            } else {
              alert("Discussion créée avec succès !");
              // Ajouter la discussion à la liste des discussions
              const discussionsList =
                document.getElementById("discussionsList");
              const discussionItem = document.createElement("div");
              discussionItem.textContent = title;
              discussionsList.appendChild(discussionItem);
            }
          } catch (error) {
            console.error(
              "Erreur lors de la création de la discussion:",
              error
            );
            alert("Une erreur s'est produite. Veuillez réessayer.");
          }
        });

      // Logique de soumission du formulaire de recommandation d'ami
      document
        .getElementById("recommendFriendForm")
        .addEventListener("submit", async function (event) {
          event.preventDefault();
          const friendId = document.getElementById("confirmedFriends").value;
          const recommenderId = localStorage.getItem("userId"); // Assure-toi que l'ID de l'utilisateur est stocké dans le localStorage

          try {
            const response = await fetch(
              "http://localhost:3000/api/recommendFriend",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ friendId, recommenderId }),
              }
            );
            const result = await response.json();

            if (result.error) {
              alert(result.error);
            } else {
              // Afficher le message de confirmation
              const recommendationMessage = document.getElementById(
                "recommendationMessage"
              );
              recommendationMessage.style.display = "block";
              setTimeout(() => {
                recommendationMessage.style.display = "none";
              }, 3000); // Masquer le message après 3 secondes
            }
          } catch (error) {
            console.error("Erreur lors de la recommandation de l'ami:", error);
            alert("Une erreur s'est produite. Veuillez réessayer.");
          }
        });
    });
  });
  document.addEventListener("DOMContentLoaded", async function () {
    // Fonction pour récupérer et afficher les amis confirmés d'un ami
    async function fetchFriendFriends(friendId) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/friendFriends/${friendId}`
        );
        const friends = await response.json();
        const friendFriendsList = document.getElementById("friendFriendsList");
        friendFriendsList.innerHTML = ""; // Vider la liste avant de la remplir

        friends.forEach((friend) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
            <img src="${friend.profilePhoto}" alt="Photo de ${friend.username}" class="friend-photo" />
            <p>Pseudonyme : ${friend.username}</p>
            <p>Nom : ${friend.lastName}</p>
            <p>Prénom : ${friend.firstName}</p>
          `;
          friendFriendsList.appendChild(listItem);
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des amis confirmés de l'ami:",
          error
        );
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
    }

    // Exemple d'appel de la fonction avec un ID d'ami spécifique
    const friendId = "ID_DE_L_AMI"; // Remplacez par l'ID réel de l'ami
    fetchFriendFriends(friendId);
  });
  document.addEventListener("DOMContentLoaded", async function () {
    async function fetchFriendFriends(memberId) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/memberFriends/${memberId}`
        );
        const friends = await response.json();
        const friendFriendsList = document.getElementById("friendFriendsList");
        friendFriendsList.innerHTML = ""; // Vider la liste avant de la remplir

        friends.forEach((friend) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
            <img src="${friend.profilePhoto}" alt="Photo de ${friend.username}" class="friend-photo" />
            <p>Pseudonyme : ${friend.username}</p>
            <p>Nom : ${friend.lastName}</p>
            <p>Prénom : ${friend.firstName}</p>
            <button class="remove-friend-button" data-friend-id="${friend._id}">Supprimer</button>
          `;
          friendFriendsList.appendChild(listItem);
        });

        // Ajouter des gestionnaires d'événements pour les boutons de suppression
        document.querySelectorAll(".remove-friend-button").forEach((button) => {
          button.addEventListener("click", async function () {
            const friendId = this.getAttribute("data-friend-id");
            const memberId = localStorage.getItem("userId"); // Assure-toi que l'ID de l'utilisateur est stocké dans le localStorage

            try {
              const response = await fetch(
                `http://localhost:3000/api/removeFriend/${memberId}/${friendId}`,
                {
                  method: "DELETE",
                }
              );
              const result = await response.json();

              if (result.error) {
                alert(result.error);
              } else {
                alert("Ami supprimé avec succès.");
                fetchFriendFriends(memberId); // Rafraîchir la liste des amis
              }
            } catch (error) {
              console.error("Erreur lors de la suppression de l'ami:", error);
              alert("Une erreur s'est produite. Veuillez réessayer.");
            }
          });
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des amis confirmés:",
          error
        );
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
    }

    // Exemple d'appel de la fonction avec un ID de membre spécifique
    const memberId = localStorage.getItem("userId"); // Assure-toi que l'ID de l'utilisateur est stocké dans le localStorage
    fetchFriendFriends(memberId);
  });
  document.addEventListener("DOMContentLoaded", async function () {
    // Fonction pour récupérer et afficher les amis confirmés d'un membre
    async function fetchMemberFriends(memberId) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/memberFriends/${memberId}`
        );
        const friends = await response.json();
        const memberFriendsList = document.getElementById("memberFriendsList");
        memberFriendsList.innerHTML = ""; // Vider la liste avant de la remplir

        friends.forEach((friend) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
            <img src="${friend.profilePhoto}" alt="Photo de ${friend.username}" class="friend-photo" />
            <p>Pseudonyme : ${friend.username}</p>
            <p>Nom : ${friend.lastName}</p>
            <p>Prénom : ${friend.firstName}</p>
            <button class="remove-friend-button" data-friend-id="${friend._id}" data-member-id="${memberId}">Supprimer</button>
          `;
          memberFriendsList.appendChild(listItem);
        });

        // Ajouter des gestionnaires d'événements pour les boutons de suppression
        document.querySelectorAll(".remove-friend-button").forEach((button) => {
          button.addEventListener("click", async function () {
            const friendId = this.getAttribute("data-friend-id");
            const memberId = this.getAttribute("data-member-id");

            try {
              const response = await fetch(
                `http://localhost:3000/api/removeFriend/${memberId}/${friendId}`,
                {
                  method: "DELETE",
                }
              );
              const result = await response.json();

              if (result.error) {
                alert(result.error);
              } else {
                alert("Ami supprimé avec succès.");
                fetchMemberFriends(memberId); // Rafraîchir la liste des amis
              }
            } catch (error) {
              console.error("Erreur lors de la suppression de l'ami:", error);
              alert("Une erreur s'est produite. Veuillez réessayer.");
            }
          });
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des amis confirmés du membre:",
          error
        );
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
    }

    // Exemple d'appel de la fonction avec un ID de membre spécifique
    const memberId = "ID_DU_MEMBRE"; // Remplacez par l'ID réel du membre
    fetchMemberFriends(memberId);
  });
  document.addEventListener("DOMContentLoaded", async function () {
    // Fonction pour récupérer et afficher les demandes d'amis
    async function fetchFriendRequests() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/friendRequests"
        );
        const requests = await response.json();
        const friendRequestsList =
          document.getElementById("friendRequestsList");
        friendRequestsList.innerHTML = ""; // Vider la liste avant de la remplir

        requests.forEach((request) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
            <img src="${request.profilePhoto}" alt="Photo de ${request.username}" class="friend-photo" />
            <p>Pseudonyme : ${request.username}</p>
            <p>Nom : ${request.lastName}</p>
            <p>Prénom : ${request.firstName}</p>
            <button class="add-friend-button" data-member-id="${request._id}">Ajouter</button>
            <button class="ignore-friend-button" data-member-id="${request._id}">Ignorer</button>
          `;
          friendRequestsList.appendChild(listItem);
        });

        // Ajouter des gestionnaires d'événements pour les boutons d'ajout
        document.querySelectorAll(".add-friend-button").forEach((button) => {
          button.addEventListener("click", async function () {
            const memberId = this.getAttribute("data-member-id");
            const adminId = "ID_DE_L_ADMIN"; // Remplacez par l'ID réel de l'administrateur

            try {
              const response = await fetch(
                `http://localhost:3000/api/addFriend/${adminId}/${memberId}`,
                {
                  method: "POST",
                }
              );
              const result = await response.json();

              if (result.error) {
                alert(result.error);
              } else {
                // Afficher le message de confirmation
                const confirmationMessage = document.getElementById(
                  "confirmationMessage"
                );
                confirmationMessage.style.display = "block";
                setTimeout(() => {
                  confirmationMessage.style.display = "none";
                }, 3000); // Masquer le message après 3 secondes

                // Supprimer l'élément de la liste sans rafraîchir la page
                this.parentElement.remove();
              }
            } catch (error) {
              console.error("Erreur lors de l'ajout de l'ami:", error);
              alert("Une erreur s'est produite. Veuillez réessayer.");
            }
          });
        });

        // Ajouter des gestionnaires d'événements pour les boutons d'ignorance
        document.querySelectorAll(".ignore-friend-button").forEach((button) => {
          button.addEventListener("click", async function () {
            const memberId = this.getAttribute("data-member-id");
            const adminId = "ID_DE_L_ADMIN"; // Remplacez par l'ID réel de l'administrateur

            try {
              const response = await fetch(
                `http://localhost:3000/api/ignoreFriendRequest/${adminId}/${memberId}`,
                {
                  method: "DELETE",
                }
              );
              const result = await response.json();

              if (result.error) {
                alert(result.error);
              } else {
                // Afficher le message d'ignorance
                const ignoreMessage = document.getElementById("ignoreMessage");
                ignoreMessage.style.display = "block";
                setTimeout(() => {
                  ignoreMessage.style.display = "none";
                }, 3000); // Masquer le message après 3 secondes

                // Supprimer l'élément de la liste sans rafraîchir la page
                this.parentElement.remove();
              }
            } catch (error) {
              console.error(
                "Erreur lors de l'ignorance de la demande d'ami:",
                error
              );
              alert("Une erreur s'est produite. Veuillez réessayer.");
            }
          });
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des demandes d'amis:",
          error
        );
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
    }

    // Appeler la fonction pour récupérer et afficher les demandes d'amis au chargement de la page
    fetchFriendRequests();
  });
  document.addEventListener("DOMContentLoaded", async function () {
    // Fonction pour récupérer et afficher la liste des utilisateurs
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        const users = await response.json();
        const usersList = document.getElementById("usersList");
        usersList.innerHTML = ""; // Vider la liste avant de la remplir

        if (users.length === 0) {
          usersList.textContent = "Aucun utilisateur trouvé.";
        } else {
          users.forEach((user) => {
            const userItem = document.createElement("div");
            userItem.innerHTML = `
              <p class="user-name" data-user-id="${user._id}">${user.username}</p>
              <p>Nom : ${user.lastName}</p>
              <p>Prénom : ${user.firstName}</p>
              <p>Email : ${user.email}</p>
              <p>Genre : ${user.gender}</p>
              <p>Âge : ${user.age}</p>
              <p>Préférences : ${user.preferences}</p>
              <p>Présentation : ${user.bio}</p>
              <img src="${user.profilePhoto}" alt="Photo de profil" class="profile-photo" />
            `;
            usersList.appendChild(userItem);
          });

          // Ajouter des gestionnaires d'événements pour les noms d'utilisateur
          document.querySelectorAll(".user-name").forEach((name) => {
            name.addEventListener("click", async function () {
              const userId = this.getAttribute("data-user-id");

              try {
                const response = await fetch(
                  `http://localhost:3000/api/user/${userId}`
                );
                const user = await response.json();

                // Afficher les détails de l'utilisateur
                document.getElementById("detailUsername").textContent =
                  user.username;
                document.getElementById("detailLastName").textContent =
                  user.lastName;
                document.getElementById("detailFirstName").textContent =
                  user.firstName;
                document.getElementById("detailEmail").textContent = user.email;
                document.getElementById("detailGender").textContent =
                  user.gender;
                document.getElementById("detailAge").textContent = user.age;
                document.getElementById("detailPreferences").textContent =
                  user.preferences;
                document.getElementById("detailBio").textContent = user.bio;
                document.getElementById("detailProfilePhoto").src =
                  user.profilePhoto;

                document.getElementById("userDetails").style.display = "block";
                document.getElementById(
                  "sendFriendRequestButton"
                ).style.display = "block";
                document
                  .getElementById("sendFriendRequestButton")
                  .setAttribute("data-user-id", user._id);

                // Afficher les recommandations d'ajout
                const recommendationsList = document.getElementById(
                  "recommendationsList"
                );
                recommendationsList.innerHTML = ""; // Vider la liste avant de la remplir
                user.friends.forEach((friend) => {
                  if (friend.status === "recommandé") {
                    const listItem = document.createElement("li");
                    listItem.textContent = `Recommandé par ${friend.recommenderId}`;
                    recommendationsList.appendChild(listItem);
                  }
                });
                document.getElementById("recommendations").style.display =
                  "block";
              } catch (error) {
                console.error(
                  "Erreur lors de la récupération des détails de l'utilisateur:",
                  error
                );
                alert("Une erreur s'est produite. Veuillez réessayer.");
              }
            });
          });

          // Ajouter un gestionnaire d'événements pour le bouton d'envoi d'invitation d'ami
          document
            .getElementById("sendFriendRequestButton")
            .addEventListener("click", async function () {
              const userId = this.getAttribute("data-user-id");
              const requesterId = localStorage.getItem("userId"); // Assure-toi que l'ID du membre demandeur est stocké dans le localStorage

              try {
                const response = await fetch(
                  "http://localhost:3000/api/sendFriendRequest",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ requesterId, userId }),
                  }
                );
                const result = await response.json();

                if (result.error) {
                  alert(result.error);
                } else {
                  // Afficher le message de confirmation
                  const requestMessage =
                    document.getElementById("requestMessage");
                  requestMessage.style.display = "block";
                  setTimeout(() => {
                    requestMessage.style.display = "none";
                  }, 3000); // Masquer le message après 3 secondes
                }
              } catch (error) {
                console.error(
                  "Erreur lors de l'envoi de l'invitation d'ami:",
                  error
                );
                alert("Une erreur s'est produite. Veuillez réessayer.");
              }
            });
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error
        );
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
    }

    // Appeler la fonction pour récupérer et afficher les utilisateurs au chargement de la page
    fetchUsers();
  });
};
document.addEventListener("DOMContentLoaded", async function () {
  // Fonction pour rechercher des membres
  async function searchMembers(query) {
    try {
      const response = await fetch("http://localhost:3000/api/searchUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const members = await response.json();
      const selectMembers = document.getElementById("selectMembers");
      selectMembers.innerHTML = ""; // Vider la liste avant de la remplir

      members.forEach((member) => {
        const option = document.createElement("option");
        option.value = member._id;
        option.textContent = `${member.username} (${member.firstName} ${member.lastName})`;
        selectMembers.appendChild(option);
      });
    } catch (error) {
      console.error("Erreur lors de la recherche des membres:", error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  }

  // Gestionnaire d'événement pour le bouton de recherche
  document
    .getElementById("searchButton")
    .addEventListener("click", function () {
      const query = document.getElementById("searchMembers").value;
      searchMembers(query);
    });

  // Logique de soumission du formulaire de création de discussion
  document
    .getElementById("createDiscussionForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const title = document.getElementById("discussionTitle").value;
      const selectedMembers = Array.from(
        document.getElementById("selectMembers").selectedOptions
      ).map((option) => option.value);

      try {
        const response = await fetch(
          "http://localhost:3000/api/createDiscussion",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, participants: selectedMembers }),
          }
        );
        const result = await response.json();

        if (result.error) {
          alert(result.error);
        } else {
          alert("Discussion créée avec succès !");
          // Ajouter la discussion à la liste des discussions
          const discussionsList = document.getElementById("discussionsList");
          const discussionItem = document.createElement("div");
          discussionItem.className = "discussion-item";
          discussionItem.dataset.discussionId = result.discussionId;
          discussionItem.innerHTML = `
          <p>${title}</p>
          <button class="deleteDiscussionButton">Supprimer</button>
          <button class="viewDiscussionButton">Voir</button>
        `;
          discussionsList.appendChild(discussionItem);

          // Mettre à jour la liste déroulante des discussions dans le formulaire de message
          const discussionSelect = document.getElementById("discussionSelect");
          const option = document.createElement("option");
          option.value = result.discussionId;
          option.textContent = title;
          discussionSelect.appendChild(option);
        }
      } catch (error) {
        console.error("Erreur lors de la création de la discussion:", error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
    });

  // Fonction pour récupérer et afficher les discussions
  document.addEventListener("DOMContentLoaded", async function () {
    async function fetchDiscussions() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/getDiscussions"
        );
        const discussions = await response.json();
        const discussionsList = document.getElementById("discussionsList");
        const discussionSelect = document.getElementById("discussionSelect"); // Select pour le formulaire de message
        discussionsList.innerHTML = ""; // Vider la liste avant de la remplir
        discussionSelect.innerHTML = ""; // Vider la liste déroulante avant de la remplir

        discussions.forEach((discussion) => {
          // Ajouter à la liste des discussions
          const discussionItem = document.createElement("div");
          discussionItem.className = "discussion-item";
          discussionItem.dataset.discussionId = discussion._id;
          discussionItem.innerHTML = `
            <p>${discussion.title}</p>
            <button class="deleteDiscussionButton">Supprimer</button>
            <button class="viewDiscussionButton">Voir</button>
          `;
          discussionsList.appendChild(discussionItem);

          // Ajouter à la liste déroulante pour la publication de messages
          const option = document.createElement("option");
          option.value = discussion._id;
          option.textContent = discussion.title;
          discussionSelect.appendChild(option);
        });

        // Gestionnaires d'événements pour la suppression et la visualisation des discussions
        document
          .querySelectorAll(".deleteDiscussionButton")
          .forEach((button) => {
            button.addEventListener("click", async function () {
              const discussionId =
                this.closest(".discussion-item").dataset.discussionId;
              try {
                const response = await fetch(
                  `http://localhost:3000/api/deleteDiscussion/${discussionId}`,
                  { method: "DELETE" }
                );
                const result = await response.json();
                if (result.error) {
                  alert(result.error);
                } else {
                  alert("Discussion supprimée avec succès !");
                  this.closest(".discussion-item").remove();
                }
              } catch (error) {
                console.error(
                  "Erreur lors de la suppression de la discussion:",
                  error
                );
                alert("Une erreur s'est produite. Veuillez réessayer.");
              }
            });
          });

        document.querySelectorAll(".viewDiscussionButton").forEach((button) => {
          button.addEventListener("click", async function () {
            const discussionId =
              this.closest(".discussion-item").dataset.discussionId;
            try {
              const response = await fetch(
                `http://localhost:3000/api/getDiscussionMessages/${discussionId}`
              );
              const messages = await response.json();
              const messagesList = document.getElementById("messagesList");
              messagesList.innerHTML = ""; // Vider la liste avant de la remplir

              messages.forEach((message) => {
                const messageItem = document.createElement("div");
                messageItem.textContent = message.content;
                messagesList.appendChild(messageItem);
              });

              document.getElementById("discussionMessages").style.display =
                "block";
              document.getElementById("postMessageForm").dataset.discussionId =
                discussionId;
            } catch (error) {
              console.error(
                "Erreur lors de la récupération des messages de la discussion:",
                error
              );
              alert("Une erreur s'est produite. Veuillez réessayer.");
            }
          });
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des discussions:", error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
    }

    // Appeler la fonction pour récupérer et afficher les discussions au chargement de la page
    fetchDiscussions();

    // Gestionnaire d'événement pour le bouton d'ouverture de discussion
    document
      .getElementById("openDiscussionButton")
      .addEventListener("click", function () {
        window.location.href = "messenger.html";
      });

    // Gestionnaire d'événement pour la publication de messages
    document
      .getElementById("postMessageForm")
      .addEventListener("submit", async function (event) {
        event.preventDefault();
        const discussionId = document.getElementById("discussionSelect").value;
        const content = document.getElementById("messageContent").value;

        try {
          const response = await fetch(
            `http://localhost:3000/api/postDiscussionMessage/${discussionId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content }),
            }
          );
          const result = await response.json();

          if (result.error) {
            alert(result.error);
          } else {
            const messagesList = document.getElementById("messagesList");
            const messageItem = document.createElement("div");
            messageItem.className = "message-item";
            messageItem.dataset.messageId = result.messageId;
            messageItem.innerHTML = `
            <p>${content}</p>
            <button class="deleteMessageButton">Supprimer</button>
          `;
            messagesList.appendChild(messageItem);

            document.getElementById("messageContent").value = ""; // Réinitialiser le champ de texte

            // Ajouter un gestionnaire d'événement pour le bouton de suppression du nouveau message
            messageItem
              .querySelector(".deleteMessageButton")
              .addEventListener("click", async function () {
                const messageId = messageItem.dataset.messageId;
                try {
                  const response = await fetch(
                    `http://localhost:3000/api/deleteDiscussionMessage/${messageId}`,
                    { method: "DELETE" }
                  );
                  const result = await response.json();
                  if (result.error) {
                    alert(result.error);
                  } else {
                    alert("Message supprimé avec succès !");
                    messageItem.remove();
                  }
                } catch (error) {
                  console.error(
                    "Erreur lors de la suppression du message:",
                    error
                  );
                  alert("Une erreur s'est produite. Veuillez réessayer.");
                }
              });
          }
        } catch (error) {
          console.error("Erreur lors de la publication du message:", error);
          alert("Une erreur s'est produite. Veuillez réessayer.");
        }
      });
  });
  document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = true; // Remplacer par une logique réelle pour vérifier si l'utilisateur est admin

    if (isAdmin) {
      // Gestion de la suppression des messages
      document.querySelectorAll(".deleteMessageButton").forEach((button) => {
        button.addEventListener("click", function () {
          const messageId =
            this.closest(".message-item").getAttribute("data-message-id");
          const messageItem = this.closest(".message-item");

          // Envoyer une requête au serveur pour supprimer le message
          fetch(`/delete-message/${messageId}`, { method: "DELETE" }).then(
            (response) => {
              if (response.ok) {
                messageItem.remove(); // Supprimer le message de la liste
              } else {
                alert("Erreur lors de la suppression du message.");
              }
            }
          );
        });
      });

      // Gestion de la suppression des discussions
      document.querySelectorAll(".deleteDiscussionButton").forEach((button) => {
        button.addEventListener("click", function () {
          const discussionId = this.getAttribute("data-discussion-id");
          const discussionItem = this.closest(".discussion-item");

          // Envoyer une requête au serveur pour supprimer la discussion
          fetch(`/delete-discussion/${discussionId}`, {
            method: "DELETE",
          }).then((response) => {
            if (response.ok) {
              discussionItem.remove(); // Supprimer la discussion de la liste
            } else {
              alert("Erreur lors de la suppression de la discussion.");
            }
          });
        });
      });
    }
  });
});
const socket = io();
document.addEventListener("DOMContentLoaded", function () {
  // Récupérer les discussions disponibles
  fetch("/api/getDiscussions")
    .then((response) => response.json())
    .then((discussions) => {
      const discussionSelect = document.getElementById("discussionSelect");
      discussions.forEach((discussion) => {
        const option = document.createElement("option");
        option.value = discussion._id;
        option.textContent = discussion.title;
        discussionSelect.appendChild(option);
      });
    });

  document
    .getElementById("joinDiscussionForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const discussionId = document.getElementById("discussionSelect").value;
      socket.emit("join discussion", discussionId);
    });
});
document.addEventListener("DOMContentLoaded", function () {
  // Récupérer les amis disponibles
  fetch("/api/getFriends")
    .then((response) => response.json())
    .then((friends) => {
      const friendSelect = document.getElementById("friendSelect");
      friends.forEach((friend) => {
        const option = document.createElement("option");
        option.value = friend._id;
        option.textContent = `${friend.firstName} ${friend.lastName}`;
        friendSelect.appendChild(option);
      });
    });

  document
    .getElementById("startDiscussionForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const friendId = document.getElementById("friendSelect").value;
      socket.emit("start discussion", friendId);
      window.location.href = "chat.html";
    });
});
document
  .getElementById("chatForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const input = document.getElementById("messageInput");
    socket.emit("chat message", input.value);
    input.value = "";
  });

socket.on("chat message", function (msg) {
  const item = document.createElement("div");
  item.textContent = msg;
  document.getElementById("messages").appendChild(item);
});

// Logique pour afficher la section administrateur
const isAdmin = true; // Remplacer par la logique réelle pour vérifier si l'utilisateur est admin
if (isAdmin) {
  document.getElementById("adminSection").style.display = "block";

  // Récupérer les amis disponibles
  fetch("/api/getFriends")
    .then((response) => response.json())
    .then((friends) => {
      const friendSelect = document.getElementById("friendSelect");
      friends.forEach((friend) => {
        const option = document.createElement("option");
        option.value = friend._id;
        option.textContent = `${friend.firstName} ${friend.lastName}`;
        friendSelect.appendChild(option);
      });
    });

  document
    .getElementById("startDiscussionForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const friendId = document.getElementById("friendSelect").value;
      socket.emit("start discussion", friendId);
      document.getElementById("chatForm").style.display = "block";
      document.getElementById("messages").innerHTML =
        "<p>En attente de l'ami...</p>";
    });
}

socket.on("discussion message", function (msg) {
  const item = document.createElement("div");
  item.textContent = msg;
  document.getElementById("messages").appendChild(item);
});
