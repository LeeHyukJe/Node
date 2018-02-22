var express=require('express');
var http=require('http');
var path=require('path');
var bodyParser=require('body-parser');
var static=require('serve-static');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');
var fs=require('fs');
var cors=require('cors');
var multer=require('multer');
var mongoose=require('mongoose');

var app=express();

app.set('port',process.env.PORT || 8080);

//미들웨어 등록
app.use('/login',static(path.join(__dirname,'login')));
app.use('/public',static(path.join(__dirname,'public')));
app.use('/uploads',static(path.join(__dirname,'uploads')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
	secret:'key',
	resave:true,
	saveUninitialized:true
}));
app.use(cors());

var storage=multer.diskStorage({
	destination:function(req,file,callback){
		callback(null,'uploads');
	},
	filename:function(req,file,callback){
		var extension=path.extname(file.originalname);
		var basename=path.basename(file.originalname,extension);
		callback(null,basename+Date.now()+extension);
	}
});

var upload=multer({
	storage:storage,
	limit:{
		files:10,
		fileSize:1024*1024*1024
	}
});

//데이터 베이스
var database;

//유저 스키마
var UserSchema;

//데이터 베이스 모델
var UserModel;

var ss;

//데이터 베이스 연결
function connectDB(){
	var databaseUrl='mongodb://127.0.0.1:27017/local';

	console.log('데이터 베이스 연결 시도');
	mongoose.Promise=global.Promise;
	mongoose.connect(databaseUrl);
	database=mongoose.connection;


	database.on('open',function(){
		console.log('데이터 베이스에 연결 되었습니다.'+databaseUrl);
	});
	database.on('error',console.error.bind(console,'몽구스 연결 에러!'));

	//스키마 정의
	UserSchema=mongoose.Schema({
		name:String,
		password:String
	});

	//UserModel정의
	UserModel=mongoose.model('회원',UserSchema);
	console.log('유저 모델 정의함');

	database.on('disconnected',function(){
	setInterval(connectDB,5000)
	});
}

var router=express.Router();

router.route('/fileUpload').post(upload.array('file',1),function(req,res){
	try{
		var files=req.files;

		var originalname;
		var fileName;
		var mimetype;
		var size;

		if(Array.isArray(files)){
			for(var i=0;i<files.length;i++){
				originalname=files[i].originalname;
				fileName=files[i].filename;
				mimetype=files[i].mimetype;
				size=files[i].size;
			}
		}
		else{
			originalname=files[0].originalname;
			fileName=files[0].filename;
			mimetype=files[0].mimetype;
			size=files[0].size;
		}

		console.log('현재 파일 정보'+originalname+' '+fileName+' '+mimetype+' '+size);

		res.send({originalname:originalname,fileName:fileName,size:size}+
			'<img src="/uploads/'+fileName+'">');
	}catch(err){
		console.log(err);
	}
})

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
	console.log(name+' '+password);
	if(database){
		authUser(database,name,password,function(err,results){
			if(err){
				throw err;
			}

			if(results){
				console.log('찾은 객체'+results[0]);
				//res.writeHead(200,{"Content-Type":'text/html;charset=utf-8'});
				res.send(results[0]);
			}
		});
	}
	if(req.session.user)
		res.redirect('/public/product.html');
	else{
		req.session.user={
			name:name,
			password:password,
			date:new Date().toLocaleString(),
			authorized:true
		};
		// res.send('<h3><a href="/public/product">public/product.html 로 이동하기</a> </h3>');
		// res.end();
	}
});

router.route('/login/sign_up').post(function(req,res){
	var name=req.body.name;
	var password=req.body.password;

	if(database){
		addUser(database,name,password,function(err,result){
			if(err){
				console.log('오류');
				return;
			}
			console.log('등록완료'+result);
		});
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

var authUser=function(db,name,password,callback){
	console.log('auth호출 됨'+name);
	// UserModel.find({"name":name},function(err,results){
	// 	if(err){
	// 		callback(err,null);
	// 		return;
	// 	}
	//
	// 	if(results.length>0){
	// 		console.log('일치하는 사용자 찾음!');
	// 		callback(null,results);
	// 	}else{
	// 		console.log('일치하는 사용자 찾지 못함!');
	// 		callback(null,null);
	// 	}
	//
	// });
	UserModel.find({"name":name,'password':password})
		.then(function(results){
			console.log('프로미스 results'+results[0].name);
			callback(null,results);

		})
		.catch(function(err){
			console.log('프로미스 results 에러남'+err);
			callback(err,null);
		});

};


var addUser=function(db,name,password,callback){
	var user=new UserModel({"name":name,'password':password});
	user.save(function(err){
		if(err){
			callback(err,null);
			return;
		}
		console.log('사용자 db 넣음');
		callback(null,user);
	});
}


var server=http.createServer(app).listen(app.get('port'),function(){
	console.log('서버가 실행되었습니다.',app.get('port'));
	connectDB();
})