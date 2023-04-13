'use strict';
import * as data from "./data.js";
import * as el from "./elements.js";
console.log(el.btnClose)

// BANKIST APP

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

createUsernames(data.accounts);
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
el.btnLogin.addEventListener('click', function (e) {
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

el.btnTransfer.addEventListener('click', function (e) {
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

el.btnClose.addEventListener('click', function (e) {
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

el.btnLoan.addEventListener('click', function (e) {
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

el.btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAcc.movements, !sorted);
  sorted = !sorted;
})

const resetField = function (fieldName) {
  fieldName.blur();
  fieldName.value = '';
};
