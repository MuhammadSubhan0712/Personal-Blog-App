import {
  collection,
  getDocs,
  query,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { db } from "./config.js";

const display = document.querySelector("#main");

let Allblogs = [];

// Function loader
function showLoader (){
  display.innerHTML = 
  `<div class="loader-container flex justify-center item-center py-12">
  <div class="loader"></div>
  </div>`
}

// To hide loader
function hideLoader (){
  const loader = document.querySelector(".loader-container");
  if (loader) 
  loader.remove 
}
// Asynchronous Function to read the data:
async function readdata() {
  showLoader(); //before fetching data:

  try {
    const q = query(collection(db, "blogs"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      Allblogs.push({ ...doc.data(), id: doc.id });
    });
    // console.log(blog_arr);
    renderdata();
  } catch (error) {
       console.error("Error fetching blogs:", error);
    display.innerHTML = `
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Failed to load blogs. Please try again later.
      </div>`
  }
  finally {
    hideLoader(); 
  }
}
readdata();

// Function to render todo data on the browser:
function renderdata() {
  display.innerHTML = "";
  if (Allblogs.length === 0) {
    display.innerHTML =`<div class="bg-gray-700 mt-5 rounded-xl flex justify-center items-center">
    <h2 class="text-white p-2 text-2xl">!!No Blog Added Yet!!</h2>
    </div>`;
    return;
  }
  Allblogs.map((blog_arr) => {
    display.innerHTML += `
    <div class="mb-10 last:mb-0">
    <div class="bg-gray-900 rounded-lg shadow-lg overflow-hidden p-6 md:p-8">
    <article class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <h2 class="text-2xl md:text-3xl font-bold text-white">${
          blog_arr.Placeholder
        }</h2>
    <p class="text-gray-300 text-sm md:text-base whitespace-nowrap"> ${
      blog_arr.time
        ? blog_arr.time.toDate().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "no time"
    }
    </p>
    </div>
    <div class="prose max-w-none">
    <p class="text-base-100 md:text-lg leading-relaxed">${blog_arr.Blog}</p>
    </div> 
    </article>
    </div>
    </div>
    </div>
    `;
  });
}

