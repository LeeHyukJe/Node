var add=function(a,b,callback){

	var result=a+b;
	callback(result);
}

var add2=function(a,b,callback){

	var result=a*b;
	callback(result);
}

var add3=function(a,b,callback){

	var result=a-b;
	callback(result);
}

var add4=function(a,b,callback){

	var result=a/b;
	callback(result);
}

var ss='';
var aa='';
var bb='';
var cc='';
function test(a,b) {
	add(a, b, function (result) {
		result = a + b;
		console.log('콜백으로 넘겨 받았다 1 ' + result);
		ss = result;
	});

	add2(a,b,function(result){
		console.log('콜백으로 넘겨 받았다 2 '+result);
		aa=result;
	});

	add3(a,b,function(result){
		console.log('콜백으로 넘겨 받았다 3 '+result);
		bb=result;
	});

	add4(a,b,function(result){
		console.log('콜백으로 넘겨 받았다 4 '+result);
		cc=result;
	});

};

test(10,10);

console.log(ss+' '+aa+' '+bb+' '+cc);

// add(10,10,function(result){
// 		console.log('콜백으로 넘겨 받았다 2 '+result);
// });
// add(10,10,function(result){
// 		console.log('콜백으로 넘겨 받았다 3 '+result);
// });
// add(10,10,function(result){
// 		console.log('콜백으로 넘겨 받았다 4 '+result);
// });




