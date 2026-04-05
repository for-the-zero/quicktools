mdui.setColorScheme('#FFAE00');

$('.add-btn').on('click',function(){
    $('.events-list').prepend($('<mdui-list-item><div class="list-item"><mdui-text-field label="按键" class="key"></mdui-text-field><mdui-text-field label="映射" class="value"></mdui-text-field><mdui-button-icon icon="clear"></mdui-button-icon></div></mdui-list-item>'));
    $('mdui-list-item > div > mdui-button-icon').on('click',function(){
        $(this).closest('mdui-list-item').remove();
        get_events();
    });
    get_events();
});

function get_events(){
    let events_list = {};
    $('.list-item').each(function(){
        events_list[ $(this).find('.key').val() ] = $(this).find('.value').val();
    });
    return events_list;
};

text_list = [];
$(document).keydown(function(e){
    let key = e.key;
    let elist = get_events();
    if(key in elist){
        text_list.push(elist[key]);
        $('mdui-card').text(text_list.join(''));
    };
});

$('.clear-btn').on('click',function(){
    text_list = [];
    $('mdui-card').text(text_list.join(''));
});
$('.copy-btn').on('click',async function(){
    let text = text_list.join('');
    try{
        await navigator.clipboard.writeText(text);
        mdui.snackbar({message:'复制成功',closeable:true});
    } catch (err) {
        mdui.snackbar({message:'复制失败',closeable:true});
    };
});