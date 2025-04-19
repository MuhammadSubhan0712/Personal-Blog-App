import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  Timestamp,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { auth, db } from "./config.js";

// Authentication state check:
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    readdata().then(() => {
      if (blog_arr.length === 0) {
        BlogHead.innerHTML = `<div class="bg-gray-100 text-2xl text-gray-700 p-8 rounded-lg text-center">
        <p class="text-2xl font-medium mb-2">📭 No Blogs Yet</p>
        <p class="text-lg">You haven't created any blogs yet. Start writing your first blog!</p>
      </div>`;
      }
    });
  } else {
    window.location = "index.html";
  }
});

// ---------------------------------------------------------
// Logout button Working:

const logout = document.querySelector("#logout-btn");

logout.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("Logout succesfully");
      alert("Logout succesfully");
      window.location = "index.html";
    })
    .catch((error) => {
      console.log(error);
      alert("Failed to logout", error);
    });
});

// Declares the dashboard variables:
const form = document.querySelector("#form");

const placeholder = document.querySelector("#placeholder");

const blog = document.querySelector("#blog");

const display = document.querySelector("#main");

const BlogHead = document.querySelector("#blogs");

let blog_arr = [];

// Function loader
function showLoader() {
  display.innerHTML = `<div class="loader-container flex justify-center item-center py-12">
  <div class="loader"></div>
  </div>`;
}

// To hide loader
function hideLoader() {
  const loader = document.querySelector(".loader-container");
  if (loader) loader.remove;
}

// Add Event listener blog form:
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Disable form during submission
  form.querySelector('button[type="submit"]').disabled = true;

  if (!currentUser) {
    alert("Please Login first");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "blogs"), {
      userId: currentUser.uid,
      Placeholder: placeholder.value,
      Blog: blog.value,
      Time: Timestamp.fromDate(new Date()),
    });

    await readdata();

    // console.log("Document written with ID: ", docRef.id);
    // blog_arr.push({
    //   userId: currentUser.uid,
    //   Placeholder: placeholder.value,
    //   id: docRef.id,
    //   Blog: blog.value,
    //   Time: Timestamp.fromDate(new Date()),
    // });

    // renderdata();

    placeholder.value = "";
    blog.value = "";
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Failed to add blog");
  }
  // Enable after
  form.querySelector('button[type="submit"]').disabled = false;
});

// Read only current user's blogs:
export async function readdata() {
  if (!currentUser) return;

  showLoader(); // before fetching blogs data

  try {
    const q = query(
      collection(db, "blogs"),
      where("userId", "==", currentUser.uid),
      orderBy("Time", "desc")
    );
    const querySnapshot = await getDocs(q);
    blog_arr = [];
    querySnapshot.forEach((doc) => {
      blog_arr.push({
        ...doc.data(),
        id: doc.id,
        Time: doc.data().Time,
      });
    });
    console.log(blog_arr);
    renderdata();
  } catch (error) {
    console.error("Error reading data:", error);
    display.innerHTML = `<div class="text-center text-2xl font-bold text-red-500">!!Error loading blogs!!</div>`;
  } finally {
    hideLoader(); //To hide loader
  }
}
// ---------------------------------------------------------

// Function to render blogs data with edit delete option:
export function renderdata() {
  display.innerHTML = "";
  BlogHead.innerHTML = "";

  try {
    if (!currentUser) {
      BlogHead.innerHTML = `<div class="bg-black text-white p-4 rounded-md text-center text-xl">
  Please login to view your blogs
  </div>`;
      return;
    }

    if (blog_arr.length === 0) {
      BlogHead.innerHTML = `
    <div class="bg-gray-100 text-2xl text-gray-700 p-8 rounded-lg text-center">
    <p class="text-2xl font-medium mb-2">📭 No Blogs Yet</p>
     <p class="text-lg">You haven't created any blogs yet. Start writing your first blog!</p>
    </div>`;
      return;
    } else {
      BlogHead.innerHTML = `
     <h2 class="text-3xl font-bold text-primary bg-white p-4 rounded-md shadow-md mb-">
      Your Blogs 📝
      </h2>`;
      blog_arr.forEach((items) => {
        display.innerHTML += `
    <div class="blog-card bg-white p-6 rounded-lg shadow-md mb-8">
    <article class="flex-1">
        <h2 class="text-4xl font-bold mb-4 text-gray-800">${
          items.Placeholder
        }</h2>
        <div class="prose max-w-none mb-6 text-gray-700">
            <p class="text-lg">${items.Blog}</p>
        </div>
      
    <p class="text-gray-500 mb-4"> ${
      items.Time
        ? items.Time.toDate().toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "no time"
    }</p>
    
      <div class="flex justify-between mt-3 space-x-4">
            <button data-id=${
              items.id
            } class="btn btn-success edit-btn">Edit</button>
            <button data-id=${
              items.id
            } class="btn btn-error delete-btn">Delete</button>
        </div>
    </article>
    </div>
    `;
      });

      // ---------------------------------------------------------

      // Foreach Add Event listener for Edit Button:

      const editBtn = document.querySelectorAll(".edit-btn");

      editBtn.forEach((btn) => {
        btn.addEventListener("click", async () => {
          const blogId = btn.getAttribute("data-id");
          const blog = blog_arr.find((b) => b.id === blogId);
          const updatepl = prompt(
            "Enter placeholder to update",
            blog.Placeholder
          );
          const updatebl = prompt("Enter blog to update", blog.Blog);

          if (updatepl && updatebl) {
            const toUpdate = doc(db, "blogs", blogId);
            await updateDoc(toUpdate, {
              Placeholder: updatepl,
              Blog: updatebl,
            });
            console.log("Values has been Updated");
            blog.Placeholder = updatepl;
            blog.Blog = updatebl;
            renderdata();
          }
        });
      });

      // ---------------------------------------------------------

      // Foreach Add Event listener for Delete Button:

      const deleteBtn = document.querySelectorAll(".delete-btn");

      deleteBtn.forEach((btn) => {
        btn.addEventListener("click", async () => {
          const blogId = btn.getAttribute("data-id");
          if (confirm("Are you sure you want to delete this blog?")) {
            await deleteDoc(doc(db, "blogs", blogId));
            console.log("Blog Deleted successfully");
            display.innerHTML = `Blog Deleted successfully`;
            blog_arr = blog_arr.filter((b) => b.id !== blogId);
            renderdata();
          }
        });
      });
    }
  } catch (error) {
    console.error("Error displaying blog", error);
    display.innerHTML = `<div class="text-red-500 p-4">Error displaying blogs: ${error.message}</div>`;
  }
}
// ---------------------------------------------------------
