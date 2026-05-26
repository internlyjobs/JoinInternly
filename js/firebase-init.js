const firebaseConfig = {
  apiKey: "AIzaSyDFsn0MgwpwtXlvr7NIuq0-vZnfAiTJTgE",
  authDomain: "internly-mvp.firebaseapp.com",
  projectId: "internly-mvp",
  storageBucket: "internly-mvp.firebasestorage.app",
  messagingSenderId: "1060532363919",
  appId: "1:1060532363919:web:c47202e95c2e889b40c6fa",
  measurementId: "G-8VSK23F1ZR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Make them globally available
window.auth = auth;
window.db = db;
