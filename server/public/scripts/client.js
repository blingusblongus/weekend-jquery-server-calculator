console.log('js loaded');

let data = {
    firstTerm: '',
    secondTerm: '',
    op: ''
}

let justLoaded = true;
let firstTerm = true;
let dot = false;

$(function(){
    console.log('jquery loaded');
    justLoaded = true;
    //GET existing history, if any
    getCalculate();

    //click handlers
    $('#btn-calculate').on('click', submit);
    $('.btn-op').on('click', setActiveOp);
    $('#btn-clear').on('click', clearValues);

    //stretch click handlers
    $('.btn-pad-btn').on('click', btnPadEnter);

})

function btnPadEnter(){
    console.log('btnpadproess')
    let btn = $(this);

    switch(true){
        case btn.hasClass('dot'):
            //add a decimal only if it hasn't been used in the current term
            if(!dot){
                firstTerm ? 
                data.firstTerm += btn.html() : data.secondTerm += btn.html();
            }
            dot = true;
            break;
        case btn.attr('id') === 'btn-0':
            //prevent the 0 button from being the first one pressed
            if(!data.firstTerm || (!firstTerm && !data.secondTerm)){
                break;
            }
        case btn.hasClass('num'):
            firstTerm ?
                data.firstTerm += btn.html() : data.secondTerm += btn.html();
            break;
        case btn.hasClass('op'):
            if(data.firstTerm){
                data.op = btn.html();
                dot = false;
                firstTerm = false;
            }   
            break;
        case btn.hasClass('equals'):
            if(data.firstTerm && data.secondTerm){
                submitPad();
            }
            break;
        default:
            console.log('switch case error');
    }

    updateCalcDisplay();
}

function updateCalcDisplay() {
    $('#calculator-display').html(`
        ${data.firstTerm} ${data.op} ${data.secondTerm}
    `);
}

function clearValues(){
    //reset data
    data = {
        firstTerm: '',
        secondTerm: '',
        op: ''
    }

    //clear number inputs
    $('.number-input').val('');
}

function setActiveOp(){
    data.op = $(this).html();
}

//deprecated for stretch
function submit() {
    //if no op selected, do nothing
    if(!data.op){
        console.log('no op selected');
        return;
    }

    //set data values
    data = {
        firstTerm: $('#first-term').val(),
        secondTerm: $('#second-term').val(),
        op: data.op
    }

    //send post request
    postCalculate(data);
}

function submitPad(){
    postCalculate(data);

}

function getCalculate(){
    $.ajax({
        method: 'GET',
        url: '/calculate'
    }).then((res)=>{
        console.log('GET /calculate', res);
        //pass the calculation history to the render function
        render(res);
    }).catch((err)=>{
        console.log('/calculate GET error', err);
    })
}

function postCalculate(){
    $.ajax({
        method: 'POST',
        url: '/calculate',
        data: data
    }).then((res) => {
        console.log(res);
        getCalculate();
    }).catch((res)=>{
        console.log(res);
    })
}

function render(serverData){
    //clear input fields and history list
    $('.number-input').val('');
    $('#history-list').empty();

    //render history for each item
    for(let item of serverData){
        $('#history-list').append(`
        <li>${item.firstTerm} ${item.op} ${item.secondTerm} = 
        ${item.result}</li>
        `)
    }

    //render result to result-span if not on initial render
    if(justLoaded){
        justLoaded = false;
    }else{
        let calcResult = serverData[0].result
        $('#result-span').html(calcResult);
        $('#calculator-display').html(calcResult);
    }

    //clear client-side data storage
    data = {
        firstTerm: '',
        secondTerm: '',
        op: ''
    }

    //reset values for the buttonPad
    firstTerm = true;
    dot = false;

    
}