
  import {
    collection,
    addDoc,
    getDocs,
    doc, 
    query,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


import { auth , db } from "./config.js";


const display = document.querySelector("#main");


let Alldata = [];

// Asynchronous Function to read the data:
 async function readdata() {
    const q = query(collection(db , "blogs"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      Alldata.push({ ...doc.data() , id: doc.id });
    });
    console.log(blog_arr);
    renderdata();
  }
  
  readdata();


  
  // Function to render todo data on the browser:
 function renderdata() {
    display.innerHTML = "";
    if (Alldata.length === 0) {
      display.innerHTML = "No data found";
      return;
    }
    Alldata.map((items) => {
      display.innerHTML +=`
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