
  import {
    collection,
    addDoc,
    getDocs,
    doc, 
    query,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


import { auth , db } from "./config.js";


const display = document.querySelector("#main");


let Allblogs = [];

// Asynchronous Function to read the data:
 async function readdata() {
    const q = query(collection(db , "blogs"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
      Allblogs.push({ ...doc.data() , id: doc.id });
    });
    // console.log(blog_arr);
    renderdata();
  }
  readdata();



  // Function to render todo data on the browser:
 function renderdata() {
    display.innerHTML = "";
    if (Allblogs.length === 0) {
      display.innerHTML = "No Blog Yet";
      return;
    }
    Allblogs.map((blog_arr) => {
      display.innerHTML +=`
    <div class="flex flex-col lg:flex-row gap-8">
    <article class="flex-1">
        <h2 class="text-4xl font-bold mb-4">${blog_arr.Placeholder}</h2>
        <div class="prose max-w-none mb-8">
            <p>${blog_arr.Blog}</p>
        </div> 
    <p> ${blog_arr.time ? blog_arr.time.toDate() : "no time"}</p>
    </article>
    </div>`;
    });
}