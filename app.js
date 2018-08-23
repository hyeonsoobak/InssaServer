var express = require('express');
var http = require('http');
var static = require('serve-static');
var bodyParser = require('body-parser');
var path = require('path');

var multer = require('multer');

var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
      cb(null, path.extname(file.originalname));
    },
  })
});

var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

var userSchema = mongoose.Schema({
  user_id: String,
  user_pw: String,
  user_name: String,
  user_age: Number,
  user_saying: String,
  user_major: String,
  user_sex: String,
  user_grade: Number,
  user_loved: {type: String, default: ""},
  user_matched: {type: String, default: ""},
  user_mentor: {type: Number, default: 0},
  user_mentee: {type: Number, default: 0}
});
var User = mongoose.model('User',userSchema);

//기본포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);


//body-parser를 사용해 application/x-www-form-urlencoded 파싱
//app.use(bodyParser.urlencoded({ extended: true }));
//body-parser를 사용해 application/json 파싱
//app.use(bodyParser.json());

//app.use(static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));
//app.set('view engine', 'jade')
//app.set('views', './views')


/*
app.get('/question', function (req, res) {
    Quest.find({}).sort({date:-1}).exec(function(err, rawContents){
      // db에서 날짜 순으로 데이터들을 가져옴
       if(err) throw err;
       res.render('question.jade', {title: "Board", contents: rawContents}); 
       // board.ejs의 title변수엔 “Board”를, contents변수엔 db 검색 결과 json 데이터를 저장해줌.
    });
});
*/
app.get('/signup', function(req, res){
  res.send('hello world!');
});

app.post('/signup', function (req, res){
  var inputData;
  
  req.on('data', function(data){
    inputData = JSON.parse(data);
  });
  
  
  req.on('end', function(){
    console.log('user_id: ' + inputData.user_id);
    console.log('user_pw: ' + inputData.user_pw);
    console.log('user_name: ' + inputData.user_name);
    console.log('user_age: ' + inputData.user_age);
    console.log('user_saying: ' + inputData.user_saying);
    console.log('user_major: ' + inputData.user_major); 
    console.log('user_sex: ' + inputData.user_sex);
    console.log('user_grade: ' + inputData.user_grade);

    var user_id = inputData.user_id;
    var user_pw = inputData.user_pw;
    var user_name = inputData.user_name;
    var user_age = inputData.user_age;
    var user_saying = inputData.user_saying;
    var user_major = inputData.user_major;
    var user_sex = inputData.user_sex;
    var user_grade = inputData.user_grade;

    var user = new User({user_id:user_id, user_pw:user_pw, user_nama:user_name, user_age:user_age, user_saying:user_saying,
      user_major:user_major, user_sex:user_sex, user_grade:user_grade})
    
    user.save(function(err){
      if (err) console.log(err);
      res.write('111');
      res.end();
    });
  });
});


app.post('/signup_test', function (req, res){
  var user_id = req.user_id;
  var user_pw = req.user_pw;
  var user_name = req.user_name;
  var user_age = req.user_age;
  var user_saying = req.user_saying;
  var user_major = req.user_major;
  var user_sex = req.user_sex;
  var user_grade = req.user_grade;

  var user = new User({user_id:user_id, user_pw:user_pw, user_nama:user_name, user_age:user_age, user_saying:user_saying,
    user_major:user_major, user_sex:user_sex, user_grade:user_grade})
    
  user.save(function(err){
    if (err) console.log(err);
    var result = {};
    result['upload_result'] = '111';
    res.json(result);
    res.end();
  });
});


app.post('/login', function (req, res){
  var inputData;
  
  req.on('data', function(data){
    inputData = JSON.parse(data);
  });
  
  req.on('end', function(){
    console.log('login_id: ' + inputData.login_id);
    console.log('login_pw: ' + inputData.login_pw);

    var user_id = inputData.login_id;
    var user_pw = inputData.login_pw;

    User.findOne({user_id:user_id, user_pw:user_pw}, function(err, rawContent){
      if (err) {
        res.write('999');
      } else if(rawContent == null){
        res.write('999');
      } else {
        res.write('111');
      }
      res.end();
    });

  });
});

app.post('/main', function (req, res){
  var inputData;
  
  req.on('data', function(data){
    inputData = JSON.parse(data);
  });
  
  req.on('end', function(){
    console.log('user_id: ' + inputData.user_id);

    var user_id = inputData.user_id;

    User.findOne({user_id:user_id}, function(err, rawContent){
      if (err) {
        res.write('999');
      } else if(rawContent == null){
        res.write('999');
      } else {
        var result = {};
        var user_mentor = rawContent.user_mentor;
        var user_mentee = rawContent.user_mentee;
        result['user_mentor'] = user_mentor;
        result['user_mentee'] = user_mentee;
        res.json(result);
      }
      res.end();
    });

  });
});

app.post('/imgUpload', upload.single('img'), function(req, res){
    console.log(req.file);
    res.json(upload_result, '111');
});
//Express 서버 시작
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express 서버를 시작했습니다. : ' + app.get('port'));
});
