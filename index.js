//elements
const e_tooltip = $('mdui-tooltip');
const e_sort = $('.sort');
const e_cate = $('.category');
const e_toollist = $('.tools');

//egg
var clk = 0;
var eggs = {
    3: '你怎么还在点',
    4: '我说了这个东西没用的，别点了',
    5: '你点了，我也不知道',
    6: '真的是……',
    7: '这么有能耐的话……',
    8: '你有本事点到第100次',
    9: '你就点吧，懒得告诉你点了多少下，你自己数去',
    50: '50下了，你还在点？',
    51: '给你一点缓冲，我是来告诉你现在在51~54下',
    55: '你就点吧，懒得告诉你点了多少下，你自己数去',
    95: '加油哦，就快到了，放慢点吧',
    100: '不是你真的这么无聊',
    101: '既然这样',
    102: '我喜欢你',
    103: '≧ ﹏ ≦',
    104: '100下是不是太少了（）',
    105: '写不动了，后面真的没了',
    106: '再见~',
    110: '我是一个装饰按钮我是一个装饰按钮我是一个装饰按钮',
};
e_tooltip.on('click',function(){
    clk++;
    if(eggs[clk]){
        $(this).attr('content',eggs[clk]);
    };
});

//trigger
e_sort.on('change',function(){
    if(e_sort.val() === ''){
        e_sort.val('recommend');
    };
    show_tools(links, e_sort.val(), e_cate.val());
});
e_cate.on('change',function(){
    if(e_cate.val() === ''){
        e_cate.val('no');
    };
    show_tools(links, e_sort.val(), e_cate.val());
});
show_tools(links, e_sort.val(), e_cate.val());
print_rcm();

function show_tools(list, sort, cate) {
    // prepare
    const categorized = {};
    if (cate === 'no') {
        categorized.no = [...list].sort((a, b) => 
            b.slot[sort] - a.slot[sort]
        );
    } else {
        list.forEach(item => {
            const categoryValue = item.slot[cate];
            if (!categorized[categoryValue]) {
                categorized[categoryValue] = [];
            };
            categorized[categoryValue].push(item);
        });
        Object.entries(categorized).forEach(([key, items]) => {
            items.sort((a, b) => 
                b.slot[sort] - a.slot[sort]
            );
        });
    };
    console.log(categorized);
    // show
    e_toollist.empty();
    if(cate === 'no'){
        for(let i=0;i<categorized.no.length;i++){
            let item = categorized.no[i];
            let card = $(`
                <mdui-card clickable href="${item.url}">
                    <mdui-icon name="${item.icon}" class="item-icon"></mdui-icon>
                    <h1>${item.name}</h1>
                    <p>${item.desc}</p>
                    ${item.github ? `<mdui-chip href="${item.github}" icon="link" target="_blank">Github</mdui-chip>` : ''}
                </mdui-card>`);
            e_toollist.append(card);
        };
    } else {
        let cate_list = cate_order[cate];
        for(let i=0;i<cate_list.length;i++){
            let key = cate_list[i][0];
            let name = cate_list[i][1];
            let items = categorized[key];
            if(items){
                let group = $(`<mdui-collapse-item value="item-${i}">
                    <mdui-list-item slot="header" icon="folder--outlined">${name}</mdui-list-item>
                </mdui-collapse-item>`);
                for(let j=0;j<items.length;j++){
                    let item = items[j];
                    let card = $(`
                        <mdui-card clickable href="${item.url}">
                            <mdui-icon name="${item.icon}" class="item-icon"></mdui-icon>
                            <h1>${item.name}</h1>
                            <p>${item.desc}</p>
                            ${item.github ? `<mdui-chip href="${item.github}" icon="link" target="_blank">Github</mdui-chip>` : ''}
                        </mdui-card>`);
                    group.append(card);
                };
                e_toollist.append(group);
            };
        };
    };
};

function print_rcm(){
    //console.log按recommand顺序打印出推荐列表，格式为：[{'键是name':'值是slot.recommend（可以为0和负数）'},...]
    let rcm_list = [];
    for(let i=0;i<links.length;i++){
        let item = links[i];
        rcm_list.push({'name':item.name,'recommend':item.slot.recommend});
    };
    rcm_list.sort(function(a,b){
        return b.recommend - a.recommend;
    });
    console.log(rcm_list);
};
