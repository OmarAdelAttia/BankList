'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (
  movements,
  sort = false,
  insertAdjacentHTMLType = 'afterbegin'
) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1
      } ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML(insertAdjacentHTMLType, html);
  });
};

// // breif solution
const createUsernames = accs => {
  accs.forEach(
    acc =>
    (acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join(''))
  );
};

// // return values using arrow function
// const createUsernames = (accs) => {
//   accs.forEach((acc) => {
//     acc.userName = acc.owner.toLowerCase().split(' ').map((name) => {
//       return name[0]
//     }).join('');
//     return acc.owner;
//   });
//   return accs;
// };

// // Jonas solution
// const createUsernames = function (accs) {
//   accs.forEach(function (acc) {
//     acc.userName = acc.owner.toLowerCase().split(' ').map((name) => name[0]).join('');
//   });
// };

createUsernames(accounts);
// console.log(accounts);

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} €`;

  const outcomes = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `${outcomes} €`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} €`;
};

let currentAcc;

// Event handlers
btnLogin.addEventListener('click', function (e) {
  // prevent form from submiting
  e.preventDefault();

  currentAcc = accounts.find(acc => acc.userName === inputLoginUsername.value);

  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    // reset input fields
    resetField(inputLoginPin);
    resetField(inputLoginUsername);

    // display UI & message
    labelWelcome.textContent = `Welcome back ${currentAcc.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Update UI
    updateUI(currentAcc);
  } else {
    // Error MSG
    containerApp.style.opacity = 0;
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieveAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  // reset the fields & blur them
  resetField(inputTransferTo);
  resetField(inputTransferAmount);

  if (
    currentAcc.balance >= amount &&
    amount > 0 &&
    recieveAcc &&
    recieveAcc?.userName !== currentAcc.userName
  ) {
    // Adding negative movement to current user
    currentAcc.movements.push(-amount);

    // Adding positive movement to recipient
    recieveAcc.movements.push(amount);

    // Update UI
    updateUI(currentAcc);
  } else {
    // error msg the amount is out if the limit
  }
});

/* My answer

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieveAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  if (Number(labelBalance.textContent.split(' ')[0]) > amount && amount > 0) {
    // Adding negative movement to current user
    labelBalance.textContent = `${(Number(labelBalance.textContent.split(' ')[0]) - amount)} €`

    // Adding positive movement to recipient
    recieveAcc.movements.push(amount);

  } else {
    // error msg the amount is out if the limit
  }

  // // reset the fields
  inputTransferTo.value = '';
  inputTransferAmount.value = '';

  console.log(amount, recieveAcc);
});
*/

const updateUI = function (account) {
  // display movements
  displayMovements(account.movements);

  // display balance
  calcDisplayBalance(account);

  // display summary
  calcDisplaySummary(account);
};

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAcc.userName &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    // get the index of the account
    const i = accounts.findIndex(acc => acc.userName === currentAcc.userName);
    // delete account
    accounts.splice(i, 1);
    // Hide UI
    containerApp.style.opacity = 0;
  } else {
    // error (you can only delete your account)
  }
  resetField(inputClosePin);
  resetField(inputCloseUsername);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAcc.movements.some(mov => mov >= amount * 0.1)) {
    // add movement
    currentAcc.movements.push(amount);
    // Update UI
    updateUI(currentAcc);
  } else {
    // display Error msg
  }

  // reset the field
  resetField(inputLoanAmount);
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAcc.movements, !sorted);
  sorted = !sorted;
})

const resetField = function (fieldName) {
  fieldName.blur();
  fieldName.value = '';
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////