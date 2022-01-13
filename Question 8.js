let nums = [11,22,33,46,75,86,97,98];
let squaredEvenNums = nums.filter(num => num%2 == 0).map( num => num * num);

console.log(squaredEvenNums);

// Now using reduce function

let sum = nums.reduce((acc, cur) => acc + cur, 0);

console.log(sum);