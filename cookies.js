var express=require('express');
var http=require('http');
var path=require('path');
var bodyParser=require('body-parser');
var static=require('serve-static');
var cookieParser=require('cookie-parser');

var app=express();

app.set('port',process.env.PORT || 8080);

//미들웨어 등록
app.use('/login',static(path.join(__dirname,'login')));
app.use('/public',static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());

var router=express.Router();
	router.route('/setUserCookie').get(function(req,res){
		res.cookie('user',{
			name:'이혁제',
			password:12345,
			date:new Date().toLocaleString()
		});

		res.redirect('/showUserCookie');
	});

	router.route('/showUserCookie').get(function(req,res){
		res.send(req.cookies);
	});

app.use('/',router);


var server=http.createServer(app).listen(app.get('port'),function(){
	console.log('서버가 실행되었습니다.',app.get('port'));
})