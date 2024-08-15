
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";



const firebaseConfig = {
  apiKey: "AIzaSyB-zfmyupSOv3n600pz7f3Wxe-FNy7o_4Q",
  authDomain: "personal-blog-app-63f23.firebaseapp.com",
  projectId: "personal-blog-app-63f23",
  storageBucket: "personal-blog-app-63f23.appspot.com",
  messagingSenderId: "1073202546398",
  appId: "1:1073202546398:web:65cd217e59332f6f46a44f",
  measurementId: "G-WPDMJBEX5Q"
};



const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);