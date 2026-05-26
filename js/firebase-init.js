import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDFsn0MgwpwtXlvr7NIuq0-vZnfAiTJTgE",
  authDomain: "internly-mvp.firebaseapp.com",
  projectId: "internly-mvp",
  storageBucket: "internly-mvp.firebasestorage.app",
  messagingSenderId: "1060532363919",
  appId: "1:1060532363919:web:c47202e95c2e889b40c6fa",
  measurementId: "G-8VSK23F1ZR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
