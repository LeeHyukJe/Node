var Calc=require('./event');

var calc=new Calc();

calc.emit('stop');

console.log('이벤트가 모듈로 성공적으로 전달 됨');