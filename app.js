

import {
    getAuth,
    onAuthStateChanged,
    signOut,
  } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

  import {
    collection,
    addDoc,
    getDocs,
    doc, 
    query,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";



import { readdata , renderdata } from "./dashboard.js";






// Asynchronous Function to read the data:
async function readdata() {
    blog_arr = [];
    const q = query(collection(db , "blogs"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      blog_arr.push({ ...doc.data() , id: doc.id });
    });
    console.log(blog_arr);
    renderdata();
  }
  
  readdata();


  // Function to render todo data on the browser:
export function renderdata() {
    display.innerHTML = "";
    if (blog_arr.length === 0) {
      display.innerHTML = "No data found";
      return;
    }
    blog_arr.map((items) => {
      display.innerHTML +=`
    <br>
    <hr>
    <div class="flex flex-col lg:flex-row gap-8">
    <article class="flex-1">
        <h2 class="text-4xl font-bold mb-4">${items.Placeholder}</h2>
        <div class="prose max-w-none mb-8">
            <p>${items.Blog}</p>
        </div>
    </article>
    </div>`;
    });
}