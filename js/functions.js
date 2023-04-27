'use strict';
import * as el from "./elements.js";

export const formatMovDate = (date, locale) => {
    // function to calculate the duration
    const calcDuration = (date, now) =>
        Math.round(Math.abs(date - now) / (1000 * 3600 * 24));

    const daysPassed = calcDuration(date, new Date());

    //to write the duration in a professional way
    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    else {
        return new Intl.DateTimeFormat(locale).format(date);
    }
};

export const formatCurrency = (locale, currency, num) =>
    new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(num);

export const displayMovements = function (
    account,
    sort = false,
    insertAdjacentHTMLType = 'afterbegin'
) {
    el.containerMovements.innerHTML = '';

    const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;

    movs.forEach((mov, i) => {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(account.movementsDates[i]);
        const displayDate = formatMovDate(date, account.locale);

        const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1
            } ${type}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formatCurrency(
                account.locale,
                account.currency,
                mov
            )}</div>
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
    el.labelBalance.textContent = formatCurrency(
        acc.locale,
        acc.currency,
        acc.balance
    );
};

export const calcDisplaySummary = acc => {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);

    el.labelSumIn.textContent = formatCurrency(acc.locale, acc.currency, incomes);

    const outcomes = Math.abs(
        acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
    );

    el.labelSumOut.textContent = formatCurrency(
        acc.locale,
        acc.currency,
        Math.abs(outcomes)
    );

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(mov => (mov * acc.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int, 0);

    el.labelSumInterest.textContent = formatCurrency(
        acc.locale,
        acc.currency,
        interest
    );
};

export const updateUI = function (account) {
    // display movements
    displayMovements(account);

    // display balance
    calcDisplayBalance(account);

    // display summary
    calcDisplaySummary(account);
};

export const startLogOutTimer = function () {
    const tick = function () {
        const min = String(Math.floor(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        // In each call, print the remaining time to UI
        el.labelTimer.textContent = `${min}:${sec}`;

        // When 0 seconds, stop timer and log out user
        if (time === 0) {
            clearInterval(timer);
            el.labelWelcome.textContent = `Log in to get started`;
            el.containerApp.style.opacity = 0;
        }
        // Decrease Is
        time--;
    };

    // set tiem to 5 minutes
    let time = 120;

    // call the timer every second
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
};

export const resetField = function (fieldName) {
    fieldName.blur();
    fieldName.value = '';
};

