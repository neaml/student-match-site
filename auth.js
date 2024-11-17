// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Utiliser Firebase Auth et Firestore
var auth = firebase.auth();
var db = firebase.firestore();
// Suivre l'état de l'utilisateur (connecté/déconnecté)
auth.onAuthStateChanged(user => {
  if (user) {
    // L'utilisateur est connecté
    document.getElementById('user-name').textContent = user.displayName || user.email;
    document.getElementById('logout-button').style.display = 'block'; // Affiche le bouton de déconnexion
    showUserProfile(user);
  } else {
    // L'utilisateur n'est pas connecté
    document.getElementById('user-name').textContent = 'Utilisateur non connecté';
    document.getElementById('logout-button').style.display = 'none'; // Cache le bouton de déconnexion
  }
});

// Fonction pour se déconnecter
document.getElementById('logout-button').addEventListener('click', () => {
  auth.signOut();
});

// Fonction pour afficher le profil utilisateur
function showUserProfile(user) {
  const userRef = db.collection('users').doc(user.uid);
  userRef.get().then(doc => {
    if (doc.exists) {
      const userData = doc.data();
      // Affiche les données utilisateur sur la page (ex : les matchs)
      console.log(userData); // Affiche les données dans la console pour tester
    }
  });
}

// Fonction pour créer un profil utilisateur (lors de la première connexion)
auth.onAuthStateChanged(user => {
  if (user) {
    const userRef = db.collection('users').doc(user.uid);
    userRef.get().then(doc => {
      if (!doc.exists) {
        // Créer un profil utilisateur
        userRef.set({
          name: user.displayName || user.email,
          email: user.email,
          matches: [],  // Liste des matchs de l'utilisateur (peut être vide au départ)
          // Autres informations à ajouter ici
        });
      }
    });
  }
});
