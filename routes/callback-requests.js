let CallbackRequest = require('../models/callback-requests').CallbackRequest;
let express = require('express');
let router = express.Router();
let uniqid = require('uniqid');
let authMiddleware = require('../middleware/auth');
var AWS = require('aws-sdk');
var ddb = new AWS.DynamoDB();
let table = 'TravelAppCallbackRequests';
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});


router.get('/', authMiddleware, async (req,resp) => {
    var params = {
        TableName : table
    };
    docClient.scan(params, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            callbackRequests = data.Items;
            resp.send(callbackRequests);
        }
    })
});


router.post('/', async (req,resp) => {
    console.log('New callback request...');
    let reqBody = req.body;
    let newCallbackRequest = {
        'id': uniqid(),
        'phoneNumber': reqBody.phoneNumber,
        'date': String(new Date())
    };
    let params = {
        TableName: table,
        Item: newCallbackRequest
    };
    console.log("Adding a new callback request...");
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
});

router.delete('/:id', authMiddleware, async (req,resp) => {
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