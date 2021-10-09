const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('server/public'));

const calculator = require('./modules/calculator.js');
let data = require('./modules/data.js');

app.listen(PORT, () => {
    console.log('listening on port', PORT);
});

app.get('/calculate', (req, res) => {
    console.log('/calculate GET')
    res.send(data);
});

app.post('/calculate', (req, res) => {
    try {
        console.log('/calculate POST');      
        data.push({
            firstTerm: req.body.firstTerm,
            secondTerm: req.body.secondTerm,
            op: req.body.op,
            result: calculator(req.body)
        })
        res.sendStatus(201);
    }catch (error){
        console.log('server-side /calculate error:', error);
        res.sendStatus(400);
    }
})