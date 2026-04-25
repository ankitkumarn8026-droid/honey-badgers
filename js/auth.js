import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBTUpfkkJ8aCh-AvoqGSApfZbjUFcUCU1c",
  authDomain: "login-602f1.firebaseapp.com",
  databaseURL: "https://login-602f1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "login-602f1",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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

get(ref(db, 'users/' + email.trim().replace(/\./g, '_')))
.then((snapshot) => {
  if (snapshot.exists()) {
    alert("User already exists");
    return null; // ❗ important
  }

  return set(ref(db, 'users/' + email.trim().replace(/\./g, '_')), {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    password: password.trim()
  });
})
.then((result) => {
  if (result === null) return; // ❗ stop here

  alert("Account Created!");
  window.location.href = "index.html";
})
.catch((error) => {
  console.log(error);
  alert("Something went wrong");
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
        get(ref(db, 'users/' + email.value.trim().replace(/\./g, '_')))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let data = snapshot.val();

            if (data.password === password.value.trim()) {
              successMsg.innerText = "Login Successful!";

              setTimeout(() => {
                window.location.href = "https://www.exoticindiaart.com/gcg/us";
              }, 1000);

            } else {
              successMsg.innerText = "Wrong Password";
            }

          } else {
            successMsg.innerText = "User Not Found";
          }
        })
        .catch((error) => {
          console.log(error);
          successMsg.innerText = "Something went wrong";
        });
      }

    });
  }

});