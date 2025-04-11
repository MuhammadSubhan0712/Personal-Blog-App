import {
  collection,
  getDocs,
  query,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { db } from "./config.js";

const display = document.querySelector("#main");

let Allblogs = [];

// Asynchronous Function to read the data:
async function readdata() {
  const q = query(collection(db, "blogs"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    Allblogs.push({ ...doc.data(), id: doc.id });
  });
  // console.log(blog_arr);
  renderdata();
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
