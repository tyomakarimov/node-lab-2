'use strict';

// initializing global constants using class and ID selectors

const regularButtons = document.getElementsByClassName('regular');

const specialButtons = document.getElementsByClassName('special');

const result = document.querySelector('.result');

const historyButton = document.getElementById('history_btn');

const historyDiv = document.querySelector('.history');

const clearButton = document.getElementById('clear');

const removeLast = document.getElementById('remove-last');

const equal = document.getElementById('equal');

// array of expressions that have been calculated

const history = [];

// boolean variable that defines whether the history is shown

let historyIsShown = false;

// special characters that will be used at sorting buttons

const specialChars = ['+', '–', '×', '÷', '(', ')'];

// adding event listener to every regular button
// each button on click writes its value to the div above

for (const button of regularButtons) {
  button.addEventListener('click', () => {
    result.innerText += button.innerText;
  });
}

// adding event listener to clear button that clears everything written in the div above

clearButton.addEventListener('click', () => {
  result.innerText = '';
});

// adding event listener to remove last button that remove the last character from the div above

removeLast.addEventListener('click', () => {
  const string = result.innerText;
  const array = string.split('');
  array.pop();
  result.innerText = array.join('');
});

// creating a function that calculates a simple operation of two numbers

const calculate = (operation, num1, num2) => {
  if (operation === '+') return num1 + num2;
  else if (operation === '–') return num1 - num2;
  else if (operation === '×') return num1 * num2;
  else if (operation === '÷') return num1 / num2;
};

// creating a function that calculates result by the given array
// array consists of only strings that can be converted to numbers and a sign of operation

const calculateArray = array => {
  let result = 0;
  for (const [index, value] of array.entries()) {
    if (index === 0) result += +value;
    else if (index % 2 === 0) {
      result = calculate(array[index - 1], result, +value);
    }
  }
  return result;
};

// creating a function that calculates a value using priority
// priority considers that multiplication and division go before addition and subtraction

const calculateWithPriority = array => {
  let withPriority = false;
  const parts2 = [];
  for (const char of specialChars) {
    if (char === '×' || char === '÷') withPriority = true;
  }
  if (withPriority) {
    for (const [index, value] of array.entries()) {
      if (value === '×' || value === '÷') {
        const previous = parts2.pop();
        const next = array[index + 1];
        const subResult = calculate(value, +previous, +next);
        parts2.push(subResult);
      } else if (array[index - 1] === '×' || array[index - 1] === '÷') continue;
      else parts2.push(value);
    }
    return calculateArray(parts2);
  } else {
    return calculateArray(array);
  }
};

// adding event listener to the "equal" button that uses all three functions declared above
// this event listener also considers brackets as operations inside them is calculated first

equal.addEventListener('click', () => {
  const digits = [];
  let expressionResult;
  for (let i = 0; i < 10; i++) {
    digits.push(i);
  }
  const string = result.innerText;
  const array = string.split('');
  const parts = [];
  for (const character of array) {
    if (!parts.length || !specialChars.includes(character)) {
      const last = parts[parts.length - 1];
      if (!parts.length || specialChars.includes(last)) parts.push(character);
      else parts[parts.length - 1] += character;
    } else parts.push(character);
  }
  let error = false;
  if (parts.includes('(')) {
    const parts2 = [];
    const expression = [];
    let opened = false;
    for (const value of parts) {
      if (value === '(') {
        opened = true;
        continue;
      } else if (value === ')') {
        opened = false;
        parts2.push(calculateWithPriority(expression));
        expression.length = 0;
      } else if (opened) expression.push(value);
      else parts2.push(value);
    }
    expressionResult = calculateWithPriority(parts2);
  } else if (!parts.includes('(') && parts.includes(')')) {
    expressionResult = 'ERROR';
    error = true;
  }
  else expressionResult = calculateWithPriority(parts);
  result.innerText = expressionResult;
  if (!error) history.push(`${string} = ${expressionResult}`);
});

// adding event listener to history button that shows and hides history
// the history is shown in the reverse way (the last expression calculated is the first in the list)

historyButton.addEventListener('click', () => {
  historyIsShown = !historyIsShown;
  if (historyIsShown) {
    historyButton.innerText = 'Hide History';
    historyDiv.innerHTML += '<h2>History</h2>';
    historyDiv.innerText += '\n' + '\n';
    for (const [index, value] of history.reverse().entries()) {
      historyDiv.innerText += `${index + 1}) ${value}` + '\n';
    }
  } else {
    historyDiv.innerHTML = '';
    historyDiv.innerText = '';
    historyButton.innerText = 'Show History';
  }
});
