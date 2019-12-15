let Post = require('../models/posts').Post;
let express = require('express');
let router = express.Router();
let uniqid = require('uniqid');
let authMiddleware = require('../middleware/auth');
var AWS = require('aws-sdk');
var ddb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});
var table = "TravelAppPosts";

router.get('/', async (req, resp) => {
    var params = {
        TableName : table
    };
    docClient.scan(params, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            posts = data.Items;
            resp.send(posts);
        }
    })
})

router.get('/:id', async (req, resp) => {
    let id = req.params.id;

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
            console.log(post);
        }
    })
    resp.send(post);
})

router.post('/', authMiddleware, async (req, resp) => {
    let reqBody = req.body;
    let imagePath;
    if (reqBody.imageUrl) {
        imagePath = reqBody.imageUrl;
    } else {
        let path = req.file.path;
        console.log(path);
        imagePath = path.substring(path.indexOf('/'), path.length);
        console.log(imagePath);
    }

    let newPost = {
        'id': uniqid(),
        'title': reqBody.title,
        'description': reqBody.description,
        'date': String(new Date()),
        'text': reqBody.text,
        'country': reqBody.country,
        'imageUrl': imagePath
    };
    let params = {
        TableName: table,
        Item: newPost
    };
    console.log("Adding a new item...");
    console.log(params)
    
    docClient.put(params, function (err, data) {
        if (err) {
            console.log(err);
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            resp.status(400);
            resp.send(err.message);
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            resp.sendStatus(200);
        }
    })
})

router.delete('/:id', authMiddleware, async (req, resp) => {
    let id = req.params.id;
    var params = {
        TableName: table,
        Key: {
            'id': id
        }
    };
    docClient.delete(params, function(err, data) {
        if (err) console.log(err);
        else console.log(data);
      });
    resp.send('Deleted.');
})

router.put('/:id', authMiddleware, async (req, resp) => {
    let id = req.params.id;
    await Post.updateOne({id: id}, req.body);
    resp.send('Updated.');
})

module.exports = router;