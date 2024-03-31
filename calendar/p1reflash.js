const $ = mdui.$;
mdui.setColorScheme('#ff4500');
const ele_parent = $('.calendar-grid');

function page1_reflash(year,month){
    ele_parent.empty();
    let first_day_day = new Date(year,month - 1,1).getDay();
    for (let i = 0; i < first_day_day; i++){
        ele_parent.append($('<div class="cal-items"></div>'));
    };
    let allmonth;
    if (new Date().getFullYear() > year){
        allmonth = 'past';
    } else if(new Date().getFullYear() < year) {
        allmonth = 'future';
    } else {
        if (new Date().getMonth() + 1 > month){
            allmonth = 'past';
        } else if (new Date().getMonth() + 1 < month){
            allmonth = 'future';
        } else {
            allmonth = 'notsure';
        };
    };
    //ele_parent.append($('<div class="cal-items day-pasted"><h1>1</h1></div>'));
    //ele_parent.append($('<div class="cal-items day-today"><h1>2</h1></div>'));
    //ele_parent.append($('<div class="cal-items day-future"><h1>2</h1></div>'));
    let days_in_month = new Date(year,month,0).getDate();
    for (let i = 0; i < days_in_month; i++){
        let this_day = i + 1;
        if (allmonth == 'past'){
            ele_parent.append($('<div id="' + this_day + '" class="cal-items day-past"><h1>' + this_day + '</h1></div>'));
        } else if (allmonth == 'future'){
            ele_parent.append($('<div id="' + this_day + '" class="cal-items day-future"><h1>' + this_day + '</h1></div>'));
        } else {
            if (new Date().getDate() > this_day){
                ele_parent.append($('<div id="' + this_day + '" class="cal-items day-past"><h1>' + this_day + '</h1></div>'));
            } else if (new Date().getDate() > this_day){
                ele_parent.append($('<div id="' + this_day + '" class="cal-items day-future"><h1>' + this_day + '</h1></div>'));
            } else {
                ele_parent.append($('<div id="' + this_day + '" class="cal-items day-today"><h1>' + this_day + '</h1></div>'));
            };
        };
    };
};