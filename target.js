var calc=require('./moduleTest');
console.log('모듈로 분리한 후  :   '+calc.add(20,100));

var calc2=require('./moduleTest2');
console.log('모듈로 분리한 후 2 : '+calc2.add1(10,10));
console.log('모듈로 분리한 후 3 : '+calc2.sub(10,20));