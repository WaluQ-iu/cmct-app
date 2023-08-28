  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
  import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

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


const registerDiv = document.getElementById("register-div");
const loginDiv = document.getElementById("login-div");

document.addEventListener("click", function(event) {
    if (event.target.id === "reg-btn") {
        registerDiv.style.display = "inline";
        loginDiv.style.display = "none";
    } else if (event.target.id === "log-btn") {
        registerDiv.style.display = "none";
        loginDiv.style.display = "inline";
    }
});

//Login is user exists
document.getElementById("login-btn").addEventListener("click", function() {
    const loginEmail = document.getElementById("login-email").value;
    const loginPassword = document.getElementById("login-password").value;
    
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        document.getElementById("result-box").style.display = "inline";
        document.getElementById("login-div").style.display = "none";
        document.getElementById("result").innerHTML = "Welcome Back. <br>" + loginEmail + " REdirecting you to the Dhashboard in a few seconds!";
        
        // Delay redirection for 6 seconds 
        setTimeout(function() {
            // Redirect to index.html after delay
            window.location.href = "dash.html";
        }, 6000); 
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        document.getElementById("result-box").style.display = "inline";
        document.getElementById("login-div").style.display = "none";
        document.getElementById("result").innerHTML = "Sorry! <br>" + loginEmail + " " + errorMessage; 
    });
});


//REgister if first time user
document.getElementById("register-btn").addEventListener("click", function() {
    const registerEmail = document.getElementById("register-email").value;
    const registerPassword = document.getElementById("register-password").value;
    
    createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        document.getElementById("result-box").style.display = "inline";
        document.getElementById("register-div").style.display = "none";
        document.getElementById("result").innerHTML = "Welcome. <br>" + registerEmail + " REdirecting you to the Dhashboard in a few seconds!";
        
        // Delay redirection for 6 seconds 
        setTimeout(function() {
            // Redirect to index.html after delay
            window.location.href = "index.html";
        }, 6000); 
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        document.getElementById("result-box").style.display = "inline";
        document.getElementById("register-div").style.display = "none";
        document.getElementById("result").innerHTML = "Sorry! <br>" + loginEmail + " " + errorMessage; 
    });
});




