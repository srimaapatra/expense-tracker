// Select DOM Elements
const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// Get Transactions from Local Storage
const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

// Initialize Transactions Array
let transactions =
  localStorage.getItem("transactions") !== null
    ? localStorageTransactions
    : [];

// Add Transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value === "") {
    alert("Please add both text and amount");
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
  };

  transactions.push(transaction);

  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  // Clear Inputs
  text.value = "";
  amount.value = "";
}

// Generate Random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Add Transaction to DOM
function addTransactionDOM(transaction) {
  // Determine Sign
  const sign = transaction.amount < 0 ? "-" : "+";

  // Create List Item
  const item = document.createElement("li");

  // Add Class Based on Amount
  item.classList.add(
    transaction.amount < 0 ? "minus" : "plus"
  );

  // Add HTML Content
  item.innerHTML = `
    ${transaction.text}
    <span>
      ${sign}$${Math.abs(transaction.amount).toFixed(2)}
    </span>

    <button
      class="delete-btn"
      onclick="removeTransaction(${transaction.id})"
    >
      x
    </button>
  `;

  // Append to List
  list.appendChild(item);
}

// Update Balance, Income & Expense
function updateValues() {
  const amounts = transactions.map(
    (transaction) => transaction.amount
  );

  // Total Balance
  const total = amounts
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);

  // Total Income
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);

  // Total Expense
  const expense = (
    amounts
      .filter((item) => item < 0)
      .reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  // Update DOM
  balance.innerText = `$${total}`;
  moneyPlus.innerText = `+$${income}`;
  moneyMinus.innerText = `-$${expense}`;
}

// Remove Transaction
function removeTransaction(id) {
  transactions = transactions.filter(
    (transaction) => transaction.id !== id
  );

  updateLocalStorage();
  init();
}

// Update Local Storage
function updateLocalStorage() {
  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );
}

// Initialize App
function init() {
  list.innerHTML = "";

  transactions.forEach(addTransactionDOM);

  updateValues();
}

// Start App
init();

// Form Submit Event
form.addEventListener("submit", addTransaction);