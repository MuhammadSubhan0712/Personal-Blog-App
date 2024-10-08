
// Import function of firebase

import { getAuth, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {auth} from "./config.js"




// Declares Variables

let form = document.querySelector("#form");

let email = document.querySelector("#email");

let password = document.querySelector("#password");

let display = document.querySelector("#para");



// Event Listener to the login form:
form.addEventListener("submit" , (event)=>{
    event.preventDefault();

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email.value , password.value)
    

      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        window.location = "dashboard.html";

        
      })
      
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error====>",errorMessage);
        display.innerHTML = `${errorMessage}`;
        alert(errorMessage);    
      });
})


