const express = require('express');
const cors = require('cors'); // middleware to allow access to this server from any other routes
const mysql = require('mysql');
const format = require('string-format');
var CURRENT_USER = ""

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123123123",
    database: "dedot"
});

const app = express();
app.use(cors());
app.use(express.json()); // JSON body parser

//Which port to listen to.
app.listen(5000, () => {
    console.log("Listening");
});


//Listen to the / route. If you receive a GET request, print blaa
app.get('/', (req, res) => {
    res.json({
        message: 'Blaa'
    });
});


/************************************************************************************/
//Listen to the /dots route and wait for a POST request.
app.post('/dots', (req, res) => {
    console.log("Server received : "+req.body);
    // Insert into db

    let inputs = req.body.input.toString();
    let timestamp = (new Date()).toString();

    console.log("Input : "+inputs+"\nTimestamp : "+timestamp);

    const query = format("INSERT INTO dots (uname, input, timestamp) VALUES ('{}', '{}', '{}')", CURRENT_USER, inputs, timestamp);
    conn.query(query, function(err, result){
        if(err) throw err;
        console.log("Done");
        res.json({dot: inputs, timestamp: timestamp});
    });

})

app.get('/dots', (req, res) => {
    let query = format("select following from follow_table where uname = '{}'",CURRENT_USER);
    var following_array;
    var promise =  new Promise(function(resolve, reject){
            conn.query(query, function(err, result, fields){
            console.log(result[0].following);
            following_array = result[0].following;
            following_array = following_array.substring(1, following_array.length-1);
            console.log("Processed : "+following_array)
            resolve('');
        })
    })
    promise.then(function(msg){
        following_array = '(' + following_array + ')';
        console.log("Processed : "+following_array)
        query = format("SELECT * FROM dots where uname in {}",following_array);
        conn.query(query, function(err, result, fields){
        if(err) throw err;
        // console.log(result);
        result.forEach(res => {
            console.log(res.id + "   " + res.input + "   " + res.timestamp);
        }); 
        console.log("\n\nDone");
        res.json(result);
    });
    })
    
});

app.post('/search', (req, res) => {
    console.log("Searching for "+ req.body.q.toString());
    q = req.body.q.toString();
    if(q === CURRENT_USER)
        res.json('Thats You');
    
    let query = format("SELECT uname FROM credentials where uname = '{}'", q);
    conn.query(query, function(err, result, fields){
        if(result[0] === undefined)
        {
            console.log("No such user");
            res.json('No such user');
        }
        else
        {
            query = format("SELECT following from follow_table where uname = '{}'", CURRENT_USER);
            console.log(query);
            already_present = false;
            conn.query(query, function(err, result, fields){
                console.log(result[0]);
                foll = JSON.parse(result[0].following);
                for (var x in foll)
                {
                    if(foll[x] === q)
                    {
                        already_present=true;
                        break;
                    }
                }
                if(!already_present){
                    old_foll = result[0].following;
                    var new_foll = old_foll.substring(0, old_foll.length-1) + ', "' + q + '"]';
                    console.log(new_foll);
                    query = format("UPDATE follow_table SET following = '{}' WHERE uname = '{}'", new_foll, CURRENT_USER);
                    conn.query(query, function(err, result){
                        res.json('Followed '+q);
                    })
                }
                else{
                    res.json("You already follow them");
                }
            })
        }
    })
})
/************************************************************************************/


/************************************************************************************/
app.post('/signIn', (req, res) => {
    const uname = req.body.uname.toString();
    const password = req.body.password.toString();
    const query = format("SELECT * FROM credentials where uname='{}' AND password='{}'",uname, password);
    console.log(query);
    conn.query(query, function(err, result, fields){
        if(err) throw err;
        if(result[0] == undefined)
        {
            console.log("No such creds" + result);
            res.json('signin.html');
            
        }
        else
        {
            console.log("GGs" + result[0].uname);
            CURRENT_USER = result[0].uname;
            res.json('index.html');
        }
    })
})

app.get('/signIn', (req, res) => {
    console.log("Gave Uname");
    res.json(CURRENT_USER);
})
/************************************************************************************/


/************************************************************************************/
app.post('/signUp', (req, res) => {
    const uname = req.body.uname.toString();
    const password = req.body.password.toString();
    let query = format("INSERT INTO credentials(uname, password) values ('{}','{}')",uname, password);
    console.log(query);
    let error_flag = false;

        conn.query(query, function(err, result, fields){
            // if(err) throw err;
            if(err)
            {
                console.log("************GOT ERROR\n\n" + err);
                console.log("Done printing error");
                error_flag = true;
                console.log("value of error flag : "+error_flag);
            }
            if(!error_flag){
                const following = format('["{}"]',uname);
                query = format("INSERT INTO follow_table values ('{}','{}')",uname, following);
                console.log(query);
                conn.query(query, function(err, result, fields){
                    // if(err) throw err;
                })
                CURRENT_USER = uname;
                console.log("Sending to index");
                res.json('index.html');
            }
            else{
                console.log("Sending username taken");
                res.json('Username taken');
            }
        })
    
})
/************************************************************************************/