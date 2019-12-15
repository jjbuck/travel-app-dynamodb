let User = require('../models/users').User;
let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
let auth = require('../controllers/auth');
var AWS = require('aws-sdk');
var ddb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});
var table = "TravelAppUsers";

router.post('/login', async (req, resp) => {
    let email = req.body.email;
    let password = req.body.password;

    var params = {
        TableName: table,
        Key:{
            "email": email
        }
    };
    
    docClient.get(params, async function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            let user = data.Item;
            console.log(user);
            if (Object.keys(user).length > 0) {
                let comparisonResult = await bcrypt.compare(password, user.password);
                if (comparisonResult) {
                    let token = auth.generateToken(user);
                    resp.cookie('auth_token', token);
                    resp.send({
                        redirectUrl: '/admin'
                    })
                } else {
                    resp.status(400);
                }
            } else {
                resp.status(400);
                resp.send('User Not Found');
            }
        }
    });
})


router.post('/register', async (req, resp) => {
    let email = req.body.email;
    let password = req.body.password;
    let encryptedPassword = await bcrypt.hash(password, 6);
    
    var user = {
        'email': email,
        'password': encryptedPassword
    };
    var params = {
        TableName: table,
        Item: user
    };
    console.log("Adding a new user...");
    
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            resp.status(500);
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            resp.sendStatus(200);
        }
    });    
})

module.exports = router;