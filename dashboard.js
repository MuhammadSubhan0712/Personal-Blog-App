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
    readdata();
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
      window.location = "login.html";
    })
    .catch((error) => {
      console.log(error);
      alert("Failed to logout", error);
    });
});

// Declares the dashboard form variables:
const form = document.querySelector("#form");

const placeholder = document.querySelector("#placeholder");

const blog = document.querySelector("#blog");

const display = document.querySelector("#main");

let blog_arr = [];

// Add Event listener blog form:
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentUser) {
    alert("Please Login first");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "blogs"), {
      userId: currentUser.uid,
      Placeholder: placeholder.value,
      Blog: blog.value,
      time: Timestamp.fromDate(new Date()),
    });

    console.log("Document written with ID: ", docRef.id);
    blog_arr.push({
      userId: currentUser.uid,
      Placeholder: placeholder.value,
      id: docRef.id,
      Blog: blog.value,
      time: Timestamp.fromDate(new Date()),
    });

    renderdata();

    placeholder.value = "";
    blog.value = "";
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

// Read only current user's blogs:
export async function readdata() {
  if (!currentUser) return;

  blog_arr = [];
  const q = query(
    collection(db, "blogs"),
    where("userId", "==", currentUser.uid),
    orderBy("time", "desc")
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    blog_arr.push({ ...doc.data(), id: doc.id });
  });
  console.log(blog_arr);
  renderdata();
}
// ---------------------------------------------------------

// Function to render blogs data with edit delete option:
export function renderdata() {
  display.innerHTML = "";

  if (blog_arr.length === 0) {
    display.innerHTML = "No Blog found yet";
    return;
  }

  blog_arr.forEach((items) => {
    display.innerHTML += `
    <div class="flex flex-col lg:flex-row gap-8">
    <article class="flex-1">
        <h2 class="text-4xl font-bold mb-4">${items.Placeholder}</h2>
        <div class="prose max-w-none mb-8">
            <p>${items.Blog}</p>
        </div>
      
    <p> ${items.time ? items.time.toDate() : "no time"}</p>
    </br>
      <div class="flex space-x-4">
            <button data-index=${index} id="edit-btn" class="btn btn-primary">Edit</button>
            <button data-index=${index} id="delete-btn" class="btn btn-danger">Delete</button>
        </div>
    </article>
    </div>
    <hr/>`;
  });

  // ---------------------------------------------------------

  // Foreach Add Event listener for Edit Button:

  const editBtn = document.querySelectorAll("#edit-btn");

  editBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const index = btn.getAttribute("data-index");
      const updatepl = prompt(
        "Enter placeholder to update",
        blog_arr[index].Placeholder
      );
      const updatebl = prompt("Enter blog to update", blog_arr[index].Blog);

      if (updatepl && updatebl) {
        const toUpdate = doc(db, "blogs", blog_arr[index].id);
        await updateDoc(toUpdate, {
          Placeholder: updatepl,
          Blog: updatebl,
        });
        console.log("Values has been Updated");
        blog_arr[index].Placeholder = updatepl;
        blog_arr[index].Blog = updatebl;
        renderdata();
      }
    });
  });

  // ---------------------------------------------------------

  // Foreach Add Event listener for Delete Button:

  const deleteBtn = document.querySelectorAll("#delete-btn");

  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const index = btn.getAttribute("data-index");

      if (confirm("Are you sure you want to delete this blog?")) {
        await deleteDoc(doc(db, "blogs", blog_arr[index].id));
        console.log("Blog Deleted successfully");
        display.innerHTML = `Blog Deleted successfully`;
        blog_arr.splice(index, 1);
        renderdata();
      }
    });
  });
}

// ---------------------------------------------------------
