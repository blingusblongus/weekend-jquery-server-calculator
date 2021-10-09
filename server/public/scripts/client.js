console.log('js loaded');

let data = {
    firstTerm: '',
    secondTerm: '',
    op: ''
}

let justLoaded = true;

$(function(){
    console.log('jquery loaded');

    //GET existing history, if any
    getCalculate();

    //click handlers
    $('#btn-calculate').on('click', submit);
    $('.btn-op').on('click', setActiveOp);
    $('#btn-clear').on('click', clearValues);

})

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

function render(data){
    //clear input fields and history list
    $('.number-input').val('');
    $('#history-list').empty();

    //render history for each item
    for(let item of data){
        $('#history-list').append(`
        <li>${item.firstTerm} ${item.op} ${item.secondTerm} = 
        ${item.result}</li>
        `)
    }

    //render result to result-span if not on initial render
    if(justLoaded){
        justLoaded = false;
    }else{
        $('#result-span').html(data[0].result);
    }

    //clear client-side data storage
    data = {
        firstTerm: '',
        secondTerm: '',
        op: ''
    }
}