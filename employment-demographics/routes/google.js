// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

function solution(S, K) {
    // write your code in JavaScript (Node.js 6.4.0)
    var string = S;
    var outputString;
    var outputArray=[];
    var arr = string.split("-");
    console.log(arr[0]);
    var s='';
    for(i=0; i<arr.length;i++)
    {
        s+=arr[i];
    }
    //a=s.length;
    //if(s.length/4===1)
        var temp = s.split("");
    console.log(temp);
    if(temp.length%4 === 1)
        outputArray[0] = temp[0];
    if(temp.length%4 === 2)
        outputArray[0] = temp[0]+temp[1];
    if(temp.length%4 === 3)
        outputArray[0] = temp[0]+temp[1]+temp[2];

    console.log(outputArray);

    for(j=1; j<temp.length; j++)
    {
        outputArray[j] = temp
    }

    //console.log(str.match(/.{3}/g));
    console.log(s);

    return(temp);
}