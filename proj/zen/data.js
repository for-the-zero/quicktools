var data = localStorage.getItem('zen');
data = JSON.parse(data);
if (data == null) {
    data = [0,0,0,0,0,0,0,0,0,0];
} else if (data.length < 10){
    data = (new Array(10 - data.length).fill(0)).concat(data);
} else if (data.length > 10) {
    data = data.slice(-10);
};

function yaxixfmt (value) {
    return (value / 60000).toFixed(2);
};
function itemfmt(params){
    let value = moment.duration(params.value);
    let hours = value.hours();
    let minutes = value.minutes();
    let seconds = value.seconds();
    let formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formattedTime;
};

var datachart = echarts.init(document.getElementById('chart'));
var opt = {
    xAxis: {data: [10,9,8,7,6,5,4,3,2,1],name: '最近10次',nameLocation: 'middle',nameGap: 25,},
    yAxis: {name: '分钟',nameLocation: 'end',nameGap: 15,axisLabel: {formatter: yaxixfmt}},
    series: [{
        type: 'line',
        data: data,
        smooth: true,
        lineStyle: {color: '#201b12',width: 3},
        itemStyle: {color: '#201b12',borderColor: '#201b12',borderWidth: 7,},
        symbol: 'circle',
    },],
    tooltip: {trigger: 'item',formatter: itemfmt}
};
datachart.setOption(opt);


///////////


const ele_btnl = $('.topbtn-l');
const ele_btnr = $('.topbtn-r');
const ele_dia = $('md-dialog');
const ele_formbtn = $('#formbtn');
const ele_input = document.querySelector('#lsedit');

ele_btnl.click(function(){window.close();});
ele_btnr.click(function(){
    ele_dia.attr('open','');
    ele_input.value = localStorage.getItem('zen');
});
ele_formbtn.click(function(){
    let value = ele_input.value;
    value = value.slice(1,-1).split(',').map(function(item){return parseInt(item);});
    value = JSON.stringify(value);
    if (value != localStorage.getItem('zen')) {
        localStorage.setItem('zen',value);
        window.location.reload();
    }
    
});
