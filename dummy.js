function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function calculateSum(a, b) {
  return a + b;
}

function calculateProduct(a, b) {
  return a * b;
}

function isEven(number) {
  return number % 2 === 0;
}

function generateRandomArray(length) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(getRandomNumber(1, 100));
  }
  return array;
}

function getArraySum(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

function getArrayAverage(array) {
  const sum = getArraySum(array);
  return sum / array.length;
}

function getRandomObject() {
  const object = {
    name: getRandomString(10),
    age: getRandomNumber(18, 99),
    score: getRandomNumber(1, 100),
  };
  return object;
}

function sortArrayDescending(array) {
  return array.sort((a, b) => b - a);
}

function reverseString(string) {
  return string.split('').reverse().join('');
}

function countLetters(string) {
  const letters = {};
  for (let i = 0; i < string.length; i++) {
    const letter = string[i];
    if (letters[letter]) {
      letters[letter]++;
    } else {
      letters[letter] = 1;
    }
  }
  return letters;
}

const randomNumber = getRandomNumber(1, 100);

const randomString = getRandomString(10);

const calcSum = calculateSum(2, 3);

const product = calculateProduct(2, 3);

const isEvenNumber = isEven(4);

const randomArray = generateRandomArray(10);

const arraySum = getArraySum(randomArray);

const arrayAverage = getArrayAverage(randomArray);

const randomObject = getRandomObject();

const sortedArray = sortArrayDescending(randomArray);

const reversedString = reverseString(randomString);

const letterCount = countLetters(randomString);
