

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";



const firebaseConfig = {
  apiKey: "AIzaSyB-zfmyupSOv3n600pz7f3Wxe-FNy7o_4Q",
  authDomain: "personal-blog-app-63f23.firebaseapp.com",
  projectId: "personal-blog-app-63f23",
  storageBucket: "personal-blog-app-63f23.appspot.com",
  messagingSenderId: "1073202546398",
  appId: "1:1073202546398:web:65cd217e59332f6f46a44f",
  measurementId: "G-WPDMJBEX5Q"
};


// Initialize Firebase

export  const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);