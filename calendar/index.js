const $ = mdui.$;
mdui.setColorScheme('#FFAA2F');

const ele_nav_b = $('mdui-navigation-bar');
const ele_nav_r = $('mdui-navigation-rail');

ele_nav_b.on('change',function(){
    changepage(ele_nav_b.attr('value'));
    setTimeout(function(){
        ele_nav_r.attr('value',ele_nav_b.attr('value'));
    },200);
});
ele_nav_r.on('change',function(){
    changepage(ele_nav_r.attr('value'));
    setTimeout(function(){
        ele_nav_b.attr('value',ele_nav_r.attr('value'));
    },200);
});


function changepage(page){
    //TODO: changepage
}