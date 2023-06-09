'use strict';
import * as data from "./data.js";
import * as el from "./elements.js";
import * as method from "./functions.js";

// BANKIST APP

method.createUsernames(data.accounts);

let currentAcc, timer;

// Event handlers
el.btnLogin.addEventListener('click', function (e) {
  // prevent form from submiting
  e.preventDefault();

  currentAcc = data.accounts.find(acc => acc.userName === el.inputLoginUsername.value);

  if (currentAcc?.pin === +el.inputLoginPin.value) {
    // reset input fields
    method.resetField(el.inputLoginPin);
    method.resetField(el.inputLoginUsername);

    // display UI & message
    el.labelWelcome.textContent = `Welcome back ${currentAcc.owner.split(' ')[0]}`;
    el.containerApp.style.opacity = 100;

    const now = new Date();
    const locale = navigator.language;
    const option = {
      year: 'numeric',
      month: 'long',
      weekday: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    // set the date format to the object
    el.labelDate.textContent = new Intl.DateTimeFormat(
      currentAcc.locale,
      option
    ).format(now);

    if (timer) clearInterval(timer);
    // logout function
    timer = method.startLogOutTimer();

    // Update UI
    method.updateUI(currentAcc);
  } else {
    // Error MSG
    el.containerApp.style.opacity = 0;
  }
});

el.btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +el.inputTransferAmount.value;
  const recieveAcc = data.accounts.find(
    acc => acc.userName === el.inputTransferTo.value
  );

  // reset the fields & blur them
  method.resetField(el.inputTransferTo);
  method.resetField(el.inputTransferAmount);

  if (
    currentAcc.balance >= amount &&
    amount > 0 &&
    recieveAcc &&
    recieveAcc?.userName !== currentAcc.userName
  ) {
    setTimeout(() => {
      // Adding negative movement to current user
      currentAcc.movements.push(-amount);

      // Adding positive movement to recipient
      recieveAcc.movements.push(amount);

      // Add transfer Date
      currentAcc.movementsDates.push(new Date().toISOString());
      recieveAcc.movementsDates.push(new Date().toISOString());

      // Update UI
      method.updateUI(currentAcc);

      // reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  } else {
    // error msg the amount is out if the limit
  }
});

el.btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    el.inputCloseUsername.value === currentAcc.userName &&
    Number(el.inputClosePin.value) === currentAcc.pin
  ) {
    // get the index of the account
    const i = data.accounts.findIndex(acc => acc.userName === currentAcc.userName);
    // delete account
    data.accounts.splice(i, 1);
    // Hide UI
    el.containerApp.style.opacity = 0;
  } else {
    // error (you can only delete your account)
  }
  method.resetField(el.inputClosePin);
  method.resetField(el.inputCloseUsername);
});

el.btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(el.inputLoanAmount.value);

  if (amount > 0 && currentAcc.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      // add movement
      currentAcc.movements.push(amount);
      // Add loan Date
      currentAcc.movementsDates.push(new Date().toISOString());
      // Update UI
      method.updateUI(currentAcc);
      // reset timer
      clearInterval(timer);
      timer = method.startLogOutTimer();
    }, 5000);
  } else {
    // display Error msg
  }

  // reset the field
  method.resetField(el.inputLoanAmount);
});

let sorted = false;

el.btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  method.displayMovements(currentAcc, !sorted);
  sorted = !sorted;
});