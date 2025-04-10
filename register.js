// Import function of firebase
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import { 
  collection, 
  addDoc 
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { auth , db } from "./config.js";



// Declare Variables

const form = document.querySelector("#form");

const fname = document.querySelector("#fname");

const lname = document.querySelector("#lname");

const email = document.querySelector("#email");

const password = document.querySelector("#password");

const display = document.querySelector("#para");



form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const auth = getAuth();

  try {
   const userCredential = await 
   createUserWithEmailAndPassword(
     auth,
     email.value,
     password.value
   );
      const user = userCredential.user;

      // Here store user info in firestore
      await addDoc (collection (db , "users") ,{
        uid: user.uid,
        firstName : fname.value,
        lastName : lname.value,
        email: email.value
      });

      display.innerHTML = " Registration Done successfully ";
      fname.value = "";
      lname.value = "";
      email.value = "";
      password.value = "";
      window.location = "login.html";
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.log(errorCode);
    console.log(errorMessage);

    display.innerHTML = `${errorMessage}`;
  }
});
