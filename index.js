var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
    content: {
    type: DataTypes.STRING,
    allowNull: false    // 강제니?
    }
}, {
  // Other model options go here
});

// 동기화
(async () => {
    await Comments.sync();
})();
// 추가한다.
// json을 할지 아래 것을 할 지 추가해야 한다.
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// ejs 뷰엔진이라는 것을 사용하겠다!!
app.set('view engine', 'ejs');
// ejs 파일을 만들어서 응답으로 보낸다

// use res.render to load up an ejs view file

// index page
// 사용하는 방법
app.get('/', async function(req, res) {

    const comments = await Comments.findAll();
    res.render('index', {comments: comments});
    // num이라는 변수에 넣는다. ejs 에서 변수를 사용 가능!!
});

app.post('/create', async function(req, res) {
    console.log(req.body);

    // 받아온 값을 저장해서 게시판 처럼 만든다.
    const { content } = req.body;

    // 유저 만들기 데이터 베이스
    const jane = await Comments.create({ content: content });

    res.redirect('/');
    // num이라는 변수에 넣는다. ejs 에서 변수를 사용 가능!!
});

// 내용을 변경 하는 것 update
app.post('/update/:id', async function(req, res) {
    console.log(req.body);

    const { content } = req.body;
    const { id } = req.params;

    await Comments.update({ content: content }, {
        where: {
            id: id
        }
    });

    res.redirect('/')
});

// 삭제하기
app.post('/delete/:id', async function(req, res) {
    console.log(req.body);

    const { content } = req.body;
    const { id } = req.params;

    await Comments.destroy({
        where: {
            id: id
    }
});

    res.redirect('/')
});

app.listen(3000);
console.log('Server is listening on port ');