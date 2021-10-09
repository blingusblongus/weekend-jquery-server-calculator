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

})

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

function render(data){
    //clear input fields
    $('.number-input').val('');

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
    

}