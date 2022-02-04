let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

//odd numbers.
const oddNumbers = numbers.filter(number => number%3 === 0);
console.log(oddNumbers);

//numbers divisible by 2 or 5.
const divisibleBy2or5 = numbers.filter(number => number%2 === 0 || number%5 === 0);
console.log(divisibleBy2or5);

//An array of numbers divisible by 3 and then squared those numbers.
const squared = oddNumbers.map(odd => odd*odd);
console.log(squared);

//The sum of the following: square the numbers divisible by 5.
const divideBy5AndSquare = numbers.filter(number => number%5 === 0).map(number => number*number);
console.log(divideBy5AndSquare);