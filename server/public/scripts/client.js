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

    //stretch click handlers
    $('.btn-pad-btn').on('click', btnPadEnter);
    $('#clear-history').on('click', deleteCalculate);
    $('#history-list').on('click', '.history-item', reRun);

})

function reRun() {
    console.log($(this).data());
}

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
        case btn.attr('id') === 'btn-pad-clear':
            clearValues();
            $('#calculator-display').val('');
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
}

function setActiveOp(){
    data.op = $(this).html();
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

function deleteCalculate(){
    $.ajax({
        method: 'DELETE',
        url: '/calculate',
        success: function (res){
            getCalculate();
        }
    })
}

function render(serverData = []){
    //clear history list
    $('#history-list').empty();

    //Don't even try to render if serverData is empty
    if(!serverData[0]){
        return;
    }

    //render history for each item
    for(let item of serverData){
        //bundle item data into li element
        let li = $(`
        <li class="history-item">${item.firstTerm} ${item.op} ${item.secondTerm} = 
        ${item.result}</li>
        `).data(item);

        //append li to DOM
        $('#history-list').append(li);
    }

    // Render result
    let calcResult = serverData[0].result
    $('#calculator-display').html(calcResult);


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