var countDownDate = new Date("Jan 1, 2023 00:00:01").getTime();
var myfunc = setInterval(function() {
var now = new Date().getTime();
var timeleft = countDownDate - now;
    
var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

console.log(days + "d ");
console.log(hours + "h ");
console.log(minutes + "m ");
console.log(seconds + "s ");

if (timeleft < 0) {
    clearInterval(myfunc);
    
    console.log(end + "Times Up");
}
}, 1000)
