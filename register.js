// Import function of firebase
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  collection,
  addDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { auth, db } from "./config.js";

// Declare Variables

const form = document.querySelector("#form");

const fname = document.querySelector("#fname");

const lname = document.querySelector("#lname");

const email = document.querySelector("#email");

const password = document.querySelector("#password");

const display = document.querySelector("#para");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;

    // Here store user info in firestore
    await setDoc(collection(db, "users", user.uid), {
      uid: user.uid,
      firstName: fname.value,
      lastName: lname.value,
      email: email.value,
      createAt: serverTimestamp(),
    });

    display.innerHTML = " Registration Done successfully ";
    fname.value = "";
    lname.value = "";
    email.value = "";
    password.value = "";

    setTimeout(() => (window.location = "login.html"), 1500);
  } catch (error) {
    console.error("Registration error", error);
    display.innerHTML = `Registration Failed: ${error.message}`;
  }
});
