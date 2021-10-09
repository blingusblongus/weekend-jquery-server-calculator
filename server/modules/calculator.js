function calculator(obj){
    console.log('calculator called');
    
    let firstTerm = Number(obj.firstTerm);
    let secondTerm = Number(obj.secondTerm);
    let op = obj.op;

    switch(op){
        case '+':
            return firstTerm + secondTerm;
        case '-':
            return firstTerm - secondTerm;
        case '*':
            return firstTerm * secondTerm;
        case '/':
            return firstTerm / secondTerm;
        default:
            return "CALCULATOR ERROR";
    }
}

module.exports = calculator;