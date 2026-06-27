// Run once the page is loaded
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  // --------------------------
  // 🔹 Register Functionality
  // --------------------------
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let user = document.getElementById("regUser").value.trim();
      let pass = document.getElementById("regPass").value.trim();

      if (user === "" || pass === "") {
        document.getElementById("regMsg").innerText = "Please enter all fields!";
        return;
      }

      if (localStorage.getItem(user)) {
        document.getElementById("regMsg").innerText = "User already exists!";
      } else {
        let userData = {
          password: pass,
          balance: 0,
          transactions: [],
        };
        localStorage.setItem(user, JSON.stringify(userData));
        alert("Registration successful! Please login now.");
        window.location.href = "index.html"; // redirect to login
      }
    });
  }

  // --------------------------
  // 🔹 Login Functionality
  // --------------------------
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let user = document.getElementById("loginUser").value.trim();
      let pass = document.getElementById("loginPass").value.trim();

      if (user === "" || pass === "") {
        document.getElementById("loginMsg").innerText = "Please enter all fields!";
        return;
      }

      let stored = localStorage.getItem(user);
      if (stored) {
        let data = JSON.parse(stored);
        if (data.password === pass) {
          localStorage.setItem("currentUser", user);
          window.location.href = "dashboard.html";
        } else {
          document.getElementById("loginMsg").innerText = "Invalid password!";
        }
      } else {
        document.getElementById("loginMsg").innerText = "User not found!";
      }
    });
  }

  // --------------------------
  // 🔹 Dashboard Functionality
  // --------------------------
  if (window.location.pathname.includes("dashboard.html")) {
    let user = localStorage.getItem("currentUser");
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    document.getElementById("welcomeUser").innerText = "Welcome, " + user;
    updateDashboard();
  }
});

// --------------------------
// 🔹 Update Dashboard
// --------------------------
function updateDashboard() {
  let user = localStorage.getItem("currentUser");
  let data = JSON.parse(localStorage.getItem(user));

  document.getElementById("balance").innerText = data.balance.toFixed(2);

  let historyList = document.getElementById("history");
  historyList.innerHTML = "";

  if (data.transactions.length === 0) {
    historyList.innerHTML = "<li>No transactions yet</li>";
    return;
  }

  data.transactions.slice().reverse().forEach((t) => {
    let li = document.createElement("li");
    li.innerText = `${t.type}: ₹${t.amount}`;
    li.style.color = t.type === "Deposit" ? "green" : "red";
    historyList.appendChild(li);
  });
}

// --------------------------
// 🔹 Deposit Money
// --------------------------
function deposit() {
  let amt = parseFloat(document.getElementById("amount").value);
  if (isNaN(amt) || amt <= 0) return alert("Enter a valid amount");

  let user = localStorage.getItem("currentUser");
  let data = JSON.parse(localStorage.getItem(user));

  data.balance += amt;
  data.transactions.push({ type: "Deposit", amount: amt });
  localStorage.setItem(user, JSON.stringify(data));

  document.getElementById("amount").value = "";
  alert("Deposited ₹" + amt + " successfully!");
  updateDashboard();
}

// --------------------------
// 🔹 Withdraw Money
// --------------------------
function withdraw() {
  let amt = parseFloat(document.getElementById("amount").value);
  if (isNaN(amt) || amt <= 0) return alert("Enter a valid amount");

  let user = localStorage.getItem("currentUser");
  let data = JSON.parse(localStorage.getItem(user));

  if (amt > data.balance) return alert("Insufficient balance!");

  data.balance -= amt;
  data.transactions.push({ type: "Withdraw", amount: amt });
  localStorage.setItem(user, JSON.stringify(data));

  document.getElementById("amount").value = "";
  alert("Withdrawn ₹" + amt + " successfully!");
  updateDashboard();
}

// --------------------------
// 🔹 Logout
// --------------------------
function logout() {
  localStorage.removeItem("currentUser");
  alert("Logged out successfully!");
  window.location.href = "index.html";
}
