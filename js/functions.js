'use strict';
import * as el from "./elements.js";

export const displayMovements = function (
    movements,
    sort = false,
    insertAdjacentHTMLType = 'afterbegin'
) {
    el.containerMovements.innerHTML = '';

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

        el.containerMovements.insertAdjacentHTML(insertAdjacentHTMLType, html);
    });
};

// // breif solution
export const createUsernames = accs => {
    accs.forEach(
        acc =>
        (acc.userName = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join(''))
    );
};

export const calcDisplayBalance = acc => {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    el.labelBalance.textContent = `${acc.balance} €`;
};

export const calcDisplaySummary = acc => {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    el.labelSumIn.textContent = `${incomes} €`;

    const outcomes = Math.abs(
        acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
    );
    el.labelSumOut.textContent = `${outcomes} €`;

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(mov => (mov * acc.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int, 0);
    el.labelSumInterest.textContent = `${interest} €`;
};

export const updateUI = function (account) {
    // display movements
    displayMovements(account.movements);

    // display balance
    calcDisplayBalance(account);

    // display summary
    calcDisplaySummary(account);
};

export const resetField = function (fieldName) {
    fieldName.blur();
    fieldName.value = '';
};