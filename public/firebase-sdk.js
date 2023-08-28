// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signOut  } from "https://www.gstatic.com/firebasejs/10.1.0//firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-nliYN0fuwcrFEgZInqPCz_Ezxk3thAc",
  authDomain: "ctmt-2eac0.firebaseapp.com",
  projectId: "ctmt-2eac0",
  storageBucket: "ctmt-2eac0.appspot.com",
  messagingSenderId: "248062387961",
  appId: "1:248062387961:web:204dd4909b997b52a66428"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
const auth = getAuth(app);


//Log out
document.getElementById("log-out-btn").addEventListener("click", function() {
  signOut(auth).then(() => {
    window.location.href = "index.html";

    }).catch((error) => {
      document.getElementById("result").innerHTML = "Sorry! <br>" + loginEmail + " " + errorMessage; 
    });


});





