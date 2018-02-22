var EventEmitter=require('events').EventEmitter;


var Calc=function(){
	this.on('stop',function(){
		console.log('stop이벤트가 발생하였음.');
	});
}

Calc.prototype=new EventEmitter;

Calc.prototype.add=function(a,b){
	return a+b;
}

module.exports=Calc;