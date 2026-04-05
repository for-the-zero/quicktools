// 初始化
//const $ = mdui.$;
mdui.setColorScheme('#ff4500');
var view_year = new Date().getFullYear();
var view_month = new Date().getMonth()+1;
var count_list;
reflashlocalstorge();
function reflashlocalstorge(){
    count_list = localStorage.getItem('calendar_count');
    if(count_list == null){
        count_list = [];
        localStorage.setItem('calendar_count',JSON.stringify(count_list));
    } else {
        count_list = JSON.parse(count_list);
    };
};


// 元素
const ele_nav = $('mdui-navigation-bar');
const ele_page1 = $('.main-1');
const ele_page2 = $('.main-2');
const ele_page3 = $('.main-3');
const ele_syear = $('.year');
const ele_smonth = $('.month');
const ele_lastmonth = $('#icon-lastmonth');
const ele_nextmonth = $('#icon-nextmonth');
const ele_todaybtn = $('#icon-today');
const ele_ymdialog = $('.year-month-dialog');
const ele_ymdialog_btn = $('.year-month-dialog #confirm-btn');
const ele_ymdialog_input = $('.year-month-dialog mdui-text-field');
const ele_sb_invalid = $('.snackbar-invalid');
const ele_sb_invalid2 = $('.snackbar-invalid2');
const ele_count_grid = $('.count-grid');
const ele_countadd_dialog = $('.add-count-dialog');
const ele_countadd_dialog_btn = $('.add-count-dialog #confirm-btn');
const ele_countadd_dialog_input_date = $('.add-count-dialog #date');
const ele_countadd_dialog_input_name = $('.add-count-dialog #name');



// 导航栏
ele_nav.on('change',function(){
    setTimeout(function(){
        changepage(ele_nav.attr('value'));
    },50);
});



// 切换
var nowpage = 1;
changepage('page-'+nowpage);
function changepage(page){
    page = page.slice(-1);
    if (page == 1) {
        ele_page1.show();
        ele_page2.hide();
        ele_page3.hide();

        view_year = new Date().getFullYear();
        view_month = new Date().getMonth()+1;
        ele_syear.text(view_year);
        ele_smonth.text(view_month);
        page1_reflash(view_year,view_month);
    } else if (page == 2) {
        ele_page1.hide();
        ele_page2.show();
        ele_page3.hide();
        page2_reflash();
    } else if (page == 3) {
        ele_page1.hide();
        ele_page2.hide();
        ele_page3.show();
    };
};



// page-1年月按钮处理
ele_lastmonth.on('click',function(){
    view_month -= 1;
    if (view_month < 1) {
        view_month = 12;
        view_year -= 1;
    };
    ele_syear.text(view_year);
    ele_smonth.text(view_month);
    page1_reflash(view_year,view_month);
});
ele_nextmonth.on('click',function(){
    view_month += 1;
    if (view_month > 12) {
        view_month = 1;
        view_year += 1;
    };
    ele_syear.text(view_year);
    ele_smonth.text(view_month);
    page1_reflash(view_year,view_month);
});
ele_todaybtn.on('click',function(){
    view_year = new Date().getFullYear();
    view_month = new Date().getMonth()+1;
    ele_syear.text(view_year);
    ele_smonth.text(view_month);
    page1_reflash(view_year,view_month);
});
var dialog_o;
ele_syear.on('click',function(){dialog_o = 'y';month_year_dialog();});
ele_smonth.on('click',function(){dialog_o = 'm';month_year_dialog();});
function month_year_dialog(){
    ele_ymdialog.attr('open','');
    if (dialog_o == 'm') {
        ele_ymdialog_input.val(view_month);
    } else if (dialog_o == 'y') {
        ele_ymdialog_input.val(view_year);
    };
};
ele_ymdialog_btn.on('click',function(){
    ele_ymdialog.removeAttr('open');
    let input_val = ele_ymdialog_input.val();
    if (/^[1-9]\d*/.test(input_val)){
        input_val = Number(input_val);
        if (dialog_o == 'y') {
            if (input_val > 1899 && input_val < 2100){
                view_year = input_val;
                ele_syear.text(view_year);
                ele_smonth.text(view_month);
                page1_reflash(view_year,view_month);
            } else {
                ele_sb_invalid.attr('open','');
            };
        } else if (dialog_o == 'm') {
            if (input_val > 0 && input_val < 13){
                view_month = input_val;
                ele_syear.text(view_year);
                ele_smonth.text(view_month);
                page1_reflash(view_year,view_month);
            } else {
                ele_sb_invalid.attr('open','');
            };
        };
    } else {
        ele_sb_invalid.attr('open','');
    };
    

});

function in_count_list(val){
    return count_list.some((t) => {return t.name == val});
};

ele_countadd_dialog_btn.on('click',function(){
    let date = ele_countadd_dialog_input_date.val();
    let name = ele_countadd_dialog_input_name.val();
    let topush = {date: date,name: name};
    reflashlocalstorge();
    if ((name == '') || (date == '') || in_count_list(name)){
        ele_sb_invalid2.attr('open','');
    } else {
        count_list.push(topush);
        localStorage.setItem('calendar_count',JSON.stringify(count_list));
    };
    page2_reflash();
});

function page2_reflash(){
    reflashlocalstorge();
    ele_count_grid.html('');
    count_list.sort(function(a,b){
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    let today = new Date();
    for (let i = 0; i < count_list.length; i++) {
        let date = new Date(count_list[i].date);
        let name = count_list[i].name;
        let time_count = date.getTime() - today.getTime();
        time_count = Math.ceil(time_count / 1000 / 60 / 60 / 24);
        let toadd = $('<mdui-card clickable><p class="counttext counttextp">' + name + '</p><h1 class="counttext counttexth1">' + time_count + '</h1></mdui-card>');
        ele_count_grid.append(toadd);
        toadd.on('contextmenu',function(e){e.preventDefault();delthiscount(name);});
    };
}
function delthiscount(name){
    //TODO:
    //console.log(name);
    count_list = count_list.filter(function(t){
        return t.name != name;
    });
    localStorage.setItem('calendar_count',JSON.stringify(count_list));
    page2_reflash();
};