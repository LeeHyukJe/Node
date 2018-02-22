function object(name,value){

}

object.prototype.speed=function(speed){
	console.log('이 객체는 '+speed+'만큼의 속도를 가지고 있습니다.');
	return 1;
}

object.constructor=function(name,value){
	this.name=name;
	this.value=value;
}

var instance=new object('토끼','깡토끼');
var ins=new object('거북이','바다거북');
console.log(instance.speed(100));