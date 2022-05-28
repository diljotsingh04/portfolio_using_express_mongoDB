// importing all the dependencies
const express = require("express");
const app = express();
const fs = require("fs");
const path = require('path');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');


const router = express.Router();
const port = process.env.PORT || 8000;

// bodyparser as json
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended:true
}));

// establishing connection with mongodb in localhost
// mongoose.connect('mongodb://127.0.0.1/portfolio_website',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// establishing connection with mongodb in cloud (atlas)
// mongodb+srv://diljot_singh:diljot_singh@diljot.buqsh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

mongoose.connect('mongodb+srv://diljot_singh:diljot_singh@diljot.buqsh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error', ()=> console.log("Error in connecting the Database"));
db.once('open', ()=> console.log("Connected to Database Successfully"));

// to use css and js file 
app.use(express.static(path.join(__dirname, "../frontend")));
// this will fetch the data from the form
app.use(express.urlencoded({ extended: true }));




// this will tackle the post requrest from the form
// saving data in output.txt file
// app.post('/contact', (req, res) => {

//     let name = req.body.name;
//     let email = req.body.email;
//     let subject = req.body.Subject;
//     let desc = req.body.desc;

//     let result = `{ 
//         name: ${name}, 
//         email: ${email}, 
//         subject: ${subject}, 
//         description: ${desc}
//     }\n`;

//     fs.appendFileSync("output.txt", result);
//     res.send("Form Submitted Successfully");
// })




// this will save data in mongoose database
app.post('/contact', (req, res) => {

    let name = req.body.name;
    let email = req.body.email;
    let subject = req.body.Subject;
    let desc = req.body.desc;

    let data = {
        "name": name,
        "email": email,
        "subject": subject,
        "desc": desc
    }

    db.collection('contact_info').insertOne(data, (err, collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    // return res.send("Form Submitted Successfully");
    return res.sendFile('redirect.html', {root: '../frontend'});

});

// this will render main html file
app.get('/', (req, res) => {
    res.sendFile('main.html', {root: '../frontend'});   
});

// makint / as home route
app.use('/', router);

app.get('/downloads',(req, res)=>{
    res.download('resume.pdf', {root: '../frontend/download_docs'})
})


// selecting the url and the port
app.listen(port, ()=>{
    console.log(`Server started at url ${port} successfully`);
});
