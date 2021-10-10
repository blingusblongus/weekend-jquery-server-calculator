//import packages
const express = require('express');
const bodyParser = require('body-parser');

//set configure server
const app = express();
const PORT = 5000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('server/public'));

//import calculator and history
const calculator = require('./modules/calculator.js');
let data = require('./modules/data.js');

//start server
app.listen(PORT, () => {
    console.log('listening on port', PORT);
});

// return data
app.get('/calculate', (req, res) => {
    console.log('/calculate GET')
    res.send(data);
});

// update data by calling calculator
app.post('/calculate', (req, res) => {
    console.log('/calculate POST');      
    data.unshift({
        firstTerm: req.body.firstTerm,
        secondTerm: req.body.secondTerm,
        op: req.body.op,
        result: calculator(req.body)
    });
    res.sendStatus(200);
})

// clear data storage
app.delete('/calculate', (req, res)=>{
    data.splice(0, data.length);

    res.sendStatus(204);
})