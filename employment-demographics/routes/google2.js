// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

function solution(A, E) {
    // write your code in JavaScript (Node.js 6.4.0)
    var longest = 0;
    var length = [];

    for(i=0; i<= A.length-1; i++)
    {
        a = A[i];
        for(j=1; j<=A.length; j++)
        {
            temp=0;
            y=j;
            while(y <= A.length)
            {
                l=2;r=3;

                for(x=0; x<=E.length-1; x++)
                {
                    if(E[2*x] === y)
                    {
                        l = E[(2*x)+1];
                        if(E[2*(x+1)] === y)
                        {
                            r = E[(2*(x+1))+1];
                        }
                        break;
                    }
                }
                if(A[l-1] === a)
                {
                    temp = temp+1;
                    y=l;
                }
                else if(A[r-1] === a)
                {
                    temp = temp+1;
                    y=r;
                }
            }
            length[i] = temp;
        }
    }

    for(i=0; i<length.length-1;i++)
    {
        if(length[i]>longest)
            longest = length[i];
    }

    return longest;
}