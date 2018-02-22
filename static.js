var express=require('express');
var http=require('http');
var path=require('path');
var static=require('serve-static');
var bodyParser=require('body-parser');


var app=express();

app.set('port',process.env.PORT|| 3000);


app.use('/public',static(path.join(__dirname,'public')));
app.use('/login',static(path.join(__dirname,'login')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var router=express.Router();
router.route('/login/login').post(function(req,res){

	var name=req.query.name||req.body.name;
	var password=req.body.password;
	


	res.send(JSON.stringify({name:name,password:password}));
});

app.use('/',router)


var server=http.createServer(app).listen(app.get('port'),function(){
	console.log('웹 서버를 시작합니다.'+app.get('port'));
});