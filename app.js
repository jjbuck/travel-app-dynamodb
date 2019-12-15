let express = require('express');
let app = express();
let mongoose = require('mongoose');
let multer = require('multer');
let cookieParser = require('cookie-parser');
let postsRouter = require('./routes/posts');
let callbackRequestRouter = require('./routes/callback-requests');
let emailRouter = require('./routes/emails');
let Post = require('./models/posts').Post;
let usersRouter = require('./routes/users');
let auth = require('./controllers/auth');

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/travels', {useNewUrlParser: true });

const port = process.env.PORT || 3000
console.log('Found port ' + port);

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

let imageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/images'),
    filename: (req, file, cb) => cb(null, file.originalname)
})

app.use(multer({storage: imageStorage}).single('imageFile'));

app.use('/posts', postsRouter);
app.use('/callback-requests', callbackRequestRouter);
app.use('/emails', emailRouter);
app.use('/users', usersRouter);

app.get('/sight', async (req, resp) => {
    let id = req.query.id;
    /*
    let post = await Post.findOne({
        id: id
    })
    */
   var params = {
    TableName: table,
        Key:{
            "id": id
        }
    };
    docClient.get(params, async function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            //let user = JSON.stringify(data.Item, null, 2);
            let post = data.Item;
            //console.log(post);
        }
    })

    resp.render('sight', {
        title: post.title,
        imageUrl: post.imageUrl,
        date: post.date,
        text: post.text
    })
})


app.get('/admin', (req, resp) => {
    let token = req.cookies['auth_token']
    if(token && auth.checkToken(token)) {
        resp.render('admin');
    } else {
        resp.redirect('/login');
    }
})

app.get('/login', (req, resp) => {
    resp.render('login');
})

app.listen(port, () => {
    console.log('Listening 3000...');
})

