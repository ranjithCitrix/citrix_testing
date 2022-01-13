//Using Math Max Function

console.log(Math.max(5,7,8,9,11));

//Now by using reduce

let arr = [5,8,9,11,12];
var max = arr.reduce(function(a,b){
    return Math.max(a,b);

}, 0);

console.log(max);