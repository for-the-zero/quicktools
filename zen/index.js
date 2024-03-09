const ele_clock = $('p.clock');
const ele_btnl = $('.btn-l');
const ele_btnr = $('.btn-r');
const ele_btnr_icon = ele_btnr.find('md-icon');
const ele_time = $('.time');
const ele_sent = $('.sentence');
const ele_tbr = $('.topbtn-r');
const ele_dia = $('md-dialog');
const ele_diaform = $('#dialogform');
const ele_formbtn = $('#formbtn');

var tstatus = 'pause-stop';
var timerecord = 0;
var timebeforepause = 0;

ele_sent.hide();

setInterval(function(){
    ele_clock.text(new Date().toLocaleTimeString());
},1000);

ele_btnr.click(function(){
    if(tstatus == 'pause-stop'){
        ele_btnr_icon.text('pause');
        ele_btnr.contents().filter(function() {
            return this.nodeType === 3 && $.trim(this.nodeValue).length > 0;
        }).replaceWith('Pause');
        tstatus = 'running';
        //
        timerecord = moment().valueOf();

    }else if(tstatus == 'running'){
        ele_btnr_icon.text('play_arrow');
        ele_btnr.contents().filter(function() {
            return this.nodeType === 3 && $.trim(this.nodeValue).length > 0;
        }).replaceWith('Start');
        tstatus = 'pause-stop';  
        timebeforepause += moment().valueOf() - timerecord;
    };

});
ele_btnl.click(function(){
    ele_btnr_icon.text('play_arrow');
    ele_btnr.contents().filter(function() {
        return this.nodeType === 3 && $.trim(this.nodeValue).length > 0;
    }).replaceWith('Start');
    tstatus = 'pause-stop';
    timebeforepause += moment().valueOf() - timerecord;
    savetime(timebeforepause);
    timebeforepause = 0;
    timerecord = 0;
});

setInterval(main, 1000);
function main() {
    if(tstatus == 'running'){
        let timepast = moment.duration(moment().valueOf() - timerecord + timebeforepause);
        //ele_time.text(timepast.format('HH:mm:ss'));
        let hours = timepast.hours();
        let minutes = timepast.minutes();
        let seconds = timepast.seconds();
        let formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        ele_time.text(formattedTime);

    };
};

function savetime(alltime) {
    let zenArray = JSON.parse(localStorage.getItem('zen')) || [];
    zenArray.push(alltime);
    localStorage.setItem('zen', JSON.stringify(zenArray));
}

//setInterval(setsentence(),1000);
ele_sent.click(setsentence);
function setsentence(){
    // https://v1.hitokoto.cn/?encode=text
    let url = 'https://v1.hitokoto.cn/?encode=text';
    $.ajax({
        type: "GET",
        url: url,
        dataType: "text",
        success: function(response){ele_sent.text(response);},
        error: function(response){ele_sent.text('Error');}
    });
};

var s_interval;
ele_tbr.click(function(){ele_dia.attr('open','')});
ele_formbtn.click(function(){
    //console.log(document.getElementById('isshowsent').shadowRoot.querySelector('.switch').classList.contains('selected'));
    //console.log(document.getElementById('isautosent').shadowRoot.querySelector('.switch').classList.contains('selected'));
    //console.log(document.getElementById('reftimesent').value);
    let s_show = document.getElementById('isshowsent').shadowRoot.querySelector('.switch').classList.contains('selected');
    let s_auto = document.getElementById('isautosent').shadowRoot.querySelector('.switch').classList.contains('selected');
    let s_reft = document.getElementById('reftimesent').value;
    if (s_show){
        ele_sent.show();
    } else {
        ele_sent.hide();
    };
    if (s_auto){
        //s_interval = setInterval(setsentence, s_reft * 1000);
        if (s_reft > 10) {
            setsentence();
            s_interval = setInterval(setsentence, s_reft * 1000);
        } else {
            s_interval = setInterval(setsentence, 10000);
        };
    } else {
        clearInterval(s_interval);
    };
});

