var express=require('express');
var http=require('http');

var app=express();

app.set('port',process.env.PORT|| 3000);

//미들웨어 실행
app.use(function(req,res,next){
	console.log('첫번째 미들웨어가 실행됨');
	req.person='mike';
	next();
});

app.use(function(req,res){
	console.log('두번째 미들웨어 실행');

	var name=req.query.name;

	var person={name:'이혁제',age:26};

	var strJson=JSON.stringify(person);

	res.send(strJson+req.person+'파리미터 '+name);

});

var server=http.createServer(app).listen(app.get('port'),function(){
	console.log('웹 서버를 시작합니다.'+app.get('port'));
});