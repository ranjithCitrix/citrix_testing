
function calc(a,b,operator)
{
    switch(operator){
    case '+':
    {
        console.log(a+b);
        
        break;
    }
    case'-':
    {
        console.log(a-b);
        break;
    }
    case'*':
    {
        console.log(a*b);
        break;
    }
    default:
      console.log("Invalid");
}
}
calc(77,88,"*");