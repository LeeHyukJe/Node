var http=require('http');
var express=require('express');
var static=require('serve-static');
var bodyParser=require('body-parser');
var path=require('path');

var app=express();

var router=express.Router();

app.set('port',process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/login',static(path.join(__dirname,'login')));
app.use('/public',static(path.join(__dirname,'public')));

router.route('/login/sign_up/:add').post(function(req,res){
	var fuc=req.params.add;
	if(fuc=='add'){
		var name=req.body.name;
		var password=req.body.password;

		res.send({name:name,password:password});
	}
	else {
		var name = req.body.name;
		var password = req.body.password;
	}
});

app.use('/',router);



var server=http.createServer(app).listen(app.get('port'),function(){
	console.log('서버가 생성되었습니다.'+app.get('port'));
})