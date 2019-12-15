let Email = require('../models/emails').Email;
let express = require('express');
let router = express.Router();
let uniqid = require('uniqid');
let authMiddleware = require('../middleware/auth');
var AWS = require('aws-sdk');
var ddb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});
var table = "TravelAppEmailRequests";

router.get('/', authMiddleware, async (req,resp) => {
    var params = {
        TableName : table
    };
    docClient.scan(params, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            items = data.Items;
            resp.send(items);
        }
    })
});

router.post('/', async (req,resp) => {
    let reqBody = req.body;

    let newEmail = {
        'id': uniqid(),
        'date': String(new Date()),
        'name': reqBody.name,
        'email': reqBody.email,
        'text': reqBody.text
    };

    let params = {
        TableName: table,
        Item: newEmail
    };
    console.log("Adding a new item...");

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
});

router.delete('/:id', authMiddleware, async (req,resp) => {
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
});

module.exports = router;