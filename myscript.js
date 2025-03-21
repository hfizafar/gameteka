// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
// import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBl6cJoyjKuDjLdOWgcSfNtk1HUHKvkFEs",
  authDomain: "authfirebase-9c084.firebaseapp.com",
  projectId: "authfirebase-9c084",
  storageBucket: "authfirebase-9c084.firebasestorage.app",
  messagingSenderId: "942052982026",
  appId: "1:942052982026:web:7e60ee3155366a3bd9cef3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
let signinButton = document.getElementById("signin-button");
let signupButton = document.getElementById("signup-button");

signupButton.addEventListener("click", (e) => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirm_password = document.getElementById("confirm_password").value;

  createUserWithEmailAndPassword(auth, email, password, confirm_password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;

    set(ref(database, "users/" + user.uid), {
      email: email,
      password: password,
      confirm_password: confirm_password
    })
    .then(() => {
      //Data Saved Sucsesfully
      alert("User Telah Sukses Dibuat");
    })
    .catch((error)=> {
      //The write failed
      alert(error);      
    });
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
  });
});

signinButton.addEventListener("click", (e) => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    let lgDate = new Date();
    update(ref(database, "users/" + user.uid), {
      last_login: lgDate
    })
    .then(() => {
      //Data Saved Sucsesfully
      alert("User Telah Sukses Login");
      location.href = "play.html";
    })
    .catch((error) => {
      //The write failed
      alert(error);
    });
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  });
  signOut(auth)
  .then(() => {})
  .catch((error) => {})
});