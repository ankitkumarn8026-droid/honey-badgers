import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getDatabase,
  ref,
  set
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";



const firebaseConfig = {
  apiKey: "AIzaSyBTUpfkkJ8aCh-AvoqGSApfZbjUFcUCU1c",
  authDomain: "login-602f1.firebaseapp.com",
  databaseURL: "https://login-602f1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "login-602f1",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
// ✅ Signup function
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const firstName = document.getElementById("First_Name").value;
  const lastName = document.getElementById("Last_Name").value; 

  if( firstName.trim() === "" ||
  lastName.trim() === "" ||
  email.trim() === "" ||
  password.trim() === "")
{
    alert("Fill all fields");
    return;


  }

createUserWithEmailAndPassword(auth, email, password)

.then((userCredential) => {

    const user = userCredential.user;

    // Only profile data save
    set(ref(db, 'users/' + user.uid), {

    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim()

})

.then(() => {

    alert("Account Created!");

    window.location.href = "index.html";

});

.catch((error) => {

    console.log(error);

    alert(error.message);

});

}

// ✅ DOM load hone ke baad sab bind karo
document.addEventListener("DOMContentLoaded", function() {

  // 🔹 Signup button
  const signupBtn = document.getElementById("signupBtn");
  if(signupBtn){
    signupBtn.addEventListener("click", signup);
  }

  // 🔹 Login form
  const form = document.getElementById("loginForm");

  if(form){
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const successMsg = document.getElementById("successMsg");

      let valid = true;

      // Email validation
      if(email.value.trim() === "") {
        email.nextElementSibling.innerText = "Email Required";
        valid = false;
      } else {
        email.nextElementSibling.innerText = "";
      }

      // Password validation
      if(password.value.trim().length < 6) {
        password.nextElementSibling.innerText = "Password must be 6+ characters";
        valid = false;
      } else {
        password.nextElementSibling.innerText = "";
      }

      // 🔹 Final check
      if(valid){

   signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value.trim()
   )

   .then((userCredential) => {

      successMsg.innerText = "Login Successful!";

      setTimeout(() => {
         window.location.href = "index.html";
      }, 1000);

   })

.catch((error) => {

    if(error.code === "auth/invalid-credential"){

        successMsg.innerText = "Invalid Email or Password";

    }

    else if(error.code === "auth/user-not-found"){

        successMsg.innerText = "User Not Found";

    }

    else if(error.code === "auth/wrong-password"){

        successMsg.innerText = "Wrong Password";

    }

    else{

        successMsg.innerText = error.message;

    }

});
}

    });
  }

});
