const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('server/public'));

const calculator = require('./modules/calculator.js');
let calcResult = 0;

app.listen(PORT, () => {
    console.log('listening on port', PORT);
});

app.get('/calculate', (req, res) => {
    console.log('/calculate GET')
    res.send(calculation);
});

app.post('/calculate', (req, res) => {
    try {
        let calculation = calculator(req.body)
        console.log('calculated result:', calculation);
        calcResult = calculation;
        res.send(200);
    }catch (error){
        console.log('server-side /calculate error:', error);
        res.sendStatus(400);
    }
})