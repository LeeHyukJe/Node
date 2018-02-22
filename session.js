var express=require('express');
var http=require('http');
var path=require('path');
var bodyParser=require('body-parser');
var static=require('serve-static');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');

var app=express();

app.set('port',process.env.PORT || 8080);

//미들웨어 등록
app.use('/login',static(path.join(__dirname,'login')));
app.use('/public',static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
	secret:'key',
	resave:true,
	saveUninitialized:true
}));

var router=express.Router();

router.route('/public/product').get(function(req,res){
	if(req.session.user){
		console.log(req.session.user);
		res.redirect('/public/product.html');
	}
	else{
		res.redirect('/login/login.html');
	}
});

router.route('/login/login').post(function(req,res){
	var name=req.body.name;
	var password=req.body.password;
	if(req.session.user)
		res.redirect('/public/product.html');
	else{
		req.session.user={
			name:name,
			password:password,
			date:new Date().toLocaleString(),
			authorized:true
		};
		res.send('<h3><a href="/public/product">public/product.html 로 이동하기</a> </h3>');
	}

});

router.route('/login/logout').get(function(req,res){
	if(req.session.user){
		req.session.destroy(function(err){
			if(err) {
				console.log('세션 삭제시 에러 발생');
				return;
			}
			else{
				console.log('로그아웃 됨');
				res.redirect('/login/login.html');
			}
		});
	}
	else{
		console.log('로그인 되어 있지 않음');
		res.redirect('/login/login.html');
	}
});

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