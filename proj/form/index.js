mdui.setColorScheme('#44FFAA');
const form_source = window.location.search.slice(1);
//console.log(form_source);
// 啊？只有ai能写出这种正则表达式了……
const urlPattern = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
const pathPattern = /^(?:[a-zA-Z]:\\)?(?:\.{1,2}\/|[a-zA-Z]:\/|\/)?[^\s]+(\.[^\s]+)+$/;
if (form_source && (urlPattern.test(form_source) || pathPattern.test(form_source))) {
    $.ajax({
        url: form_source,
        type: 'GET',
        success: function(data){load_form(data);},
        error: function(){load_faild();}
    });
} else {
    load_faild();
};
function load_faild(){
    $('.invalid-dialog mdui-text-field').val(form_source);
    $('.invalid-dialog').attr('open','');
    $('.invalid-dialog mdui-button').on('click',function(){
        let new_url = window.location.href.replace(window.location.search, '');
        new_url += '?' + $('.invalid-dialog mdui-text-field').val()
        window.location.href = new_url;
    });
};


var markdown = new markdownit({html:true,linkify:true,typographer:true});
markdown.renderer.rules.hr = function(tokens, idx) {
    return '<mdui-divider></mdui-divider>';
};
markdown.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const content = token.content;
    const langName = token.info ? ` language-${token.info.trim()}` : '';
    return `<pre class="codeblock"><code class="codeblock${langName}">${content}</code></pre>\n`;
};
var verify_code = 'true';
customs();
function customs(){
    // 1. 独占一行，只有一个，所有文本最开头，交给函数meta_load(内容)处理，以!&-->开头，阻止默认行为
    // 2. 独占一行，有多个，交给函数add_ctrls(内容)处理，以&-->开头，阻止默认行为
    markdown.renderer.rules.paragraph_open = function(tokens, idx) {
        let token = tokens[idx];
        let content = tokens[idx + 1].content;
        if (content.startsWith('!&-->')) {
            return meta_load(content);
        } else if (content.startsWith('&-->')){
            return add_ctrls(content);
        } else if (content.startsWith('&==>')){
            verify_code = content.slice(4);
            return '';
        } else {
            return '<p>';
        };
    };
};
function load_form(data){
    $('.main').html(markdown.render(data));
    document.querySelectorAll('.main').forEach(function(main) {
        var childNodes = main.childNodes;
        for (var i = childNodes.length - 1; i >= 0; i--) {
            var node = childNodes[i];
            if (node.nodeType === 3) {
                node.parentNode.removeChild(node);
          };
        };
    });
    add_listeners();
    $('.main p').filter(function(){
        return $(this).text().trim() === '';
    }).remove();
    $('.main').append('<mdui-divider></mdui-divider>');
    if(norep){no_repeat();};
    $('.main').append('<mdui-button class="submit-btn" full-width>提交</mdui-button>');
    auto_save_processing();
    setInterval(function(){
        if(!$('.autosave-dialog').attr('open')){
            let value = get_result_obj();
            localStorage.setItem(`Form-${sha256(form_source)}`,JSON.stringify(value[0]));    
        };
    },10000);
    $('.submit-btn').on('click',submiting);
};

function sha256(value){
    let shaobj = new jsSHA("SHA-256", "TEXT");
    shaobj.update(value);
    return shaobj.getHash("HEX");
};

var send_to = 'localhost';
var upload_to = 'localhost';
var norep = false;
function meta_load(meta){
    //console.log(meta);
    meta = meta.slice(5);
    meta = JSON.parse(meta);
    document.title = meta.title;
    if (meta.theme){
        mdui.setColorScheme(meta.theme);
    };
    if (meta.upload){
        upload_to = meta.upload;
    };
    if (meta.norep){
        norep = true;
        norep_ask = meta.norep;
    }
    send_to = meta.to;
    return '';
};
var ctrls = [];
var record_files_or_tags = {};
function add_ctrls(jsondata){
    //console.log(jsondata);
    let ctrl = JSON.parse(jsondata.slice(4));
    ctrls.push(ctrl);
    let processing = '';
    switch (ctrl.type) {
        case 'text':
            processing = `<mdui-text-field id="${ctrl.id}" class="space" variant="outlined" label="${ctrl.config.holder}" type="${ctrl.config.type}"></mdui-text-field>`;
            return processing;
        case 'textarea':
            processing = `<mdui-text-field id="${ctrl.id}" class="space" rows="4" label="${ctrl.config.holder}" variant="outlined"></mdui-text-field>`;
            return processing;
        case 'radios':
            processing = `<mdui-radio-group id="${ctrl.id}" class="space" value="${ctrl.config.opt[0]}">`
            for (let i = 0; i < ctrl.config.opt.length; i++) {
                processing += `<mdui-radio value="${ctrl.config.opt[i]}">${ctrl.config.opt[i]}</mdui-radio>`
                if (ctrl.config.br){processing += '<br>'};
            };
            processing += '</mdui-radio-group>';
            processing += '<br>'
            return processing;
        case 'checkboxs':
            processing = `<mdui-checkbox id="${ctrl.id}" class="space">${ctrl.config.label}</mdui-checkbox>`;
            if (ctrl.config.br){processing += '<br>';};
            return processing;
        case 'select':
            processing = `<mdui-select id="${ctrl.id}" variant="outlined" value="${ctrl.config.opt[0]}" icon="keyboard_arrow_down">`;
            for (let i = 0; i < ctrl.config.opt.length; i++) {
                processing += `<mdui-menu-item value="${ctrl.config.opt[i]}">${ctrl.config.opt[i]}</mdui-menu-item>`;
            }
            processing += '</mdui-select>'
            return processing;
        case 'tagsinput':
            if (ctrl.config.pinnedtags){
                processing = `<mdui-select id="${ctrl.id}" variant="outlined" multiple placeholder="选择标签" icon="keyboard_arrow_down">`;
                for (let i = 0; i < ctrl.config.tags.length; i++) {
                    processing += `<mdui-menu-item value="${ctrl.config.tags[i]}">${ctrl.config.tags[i]}</mdui-menu-item>`;
                };
                processing += `</mdui-select>`;
            } else {
                processing = `<mdui-card id="${ctrl.id}" variant="outlined" class="complex-con">`;
                    processing += `<div class="complex-con-list">`
                    processing += `</div>`;
                    processing += `<mdui-divider></mdui-divider>`;
                    processing += '<div class="complex-con-controls">';
                        processing += `<mdui-tooltip content="点击标签可删除" placement="right"><mdui-icon name="info"></mdui-icon></mdui-tooltip>`;
                        processing += `<mdui-text-field label="添加"></mdui-text-field>`;
                        processing += `<mdui-button variant="elevated" icon="add">添加</mdui-button>`;
                    processing += `</div>`;
                processing += `</mdui-card>`;
                //
                record_files_or_tags[ctrl.id] = [];
            };
            return processing;
        case 'files':
            processing = `<mdui-card id="${ctrl.id}" variant="outlined" class="complex-con">`;
                processing += `<div class="complex-con-list">`
                processing += `</div>`;
                processing += `<mdui-divider></mdui-divider>`;
                processing += '<div class="complex-con-controls">';
                processing += `<mdui-tooltip content="点击标签可取消上传该文件" placement="right"><mdui-icon name="info"></mdui-icon></mdui-tooltip>`;
                    if (ctrl.config.withtext) {
                        processing += `<mdui-text-field label="文件描述，上传后会自动添加进去"></mdui-text-field>`;
                    };
                    processing += `<mdui-button variant="elevated" icon="upload">上传</mdui-button>`;
                    processing += `</div>`;
            processing += `</mdui-card>`;
            return processing;
        case 'table':
            let tabel_btns = `<mdui-segmented-button-group selects="single">`;
            for(let i = 0; i < ctrl.config.column.length; i++){
                tabel_btns += `<mdui-segmented-button value="${ctrl.config.column[i]}">${ctrl.config.column[i]}</mdui-segmented-button>`;
            };
            tabel_btns += `</mdui-segmented-button-group>`;
            //
            processing = `<mdui-card id="${ctrl.id}" variant="outlined" class="tabel-grid">`;
            for(let i = 0; i < ctrl.config.row.length; i++){
                processing += `<p>${ctrl.config.row[i]}</p>`;
                processing += tabel_btns;
            };
            processing += `</mdui-card>`;
            return processing;
    }
};

const fileinput = document.createElement('input');
fileinput.type = 'file';
fileinput.multiple = true;

function add_listeners(){
    for(let i = 0; i < ctrls.length; i++){
        if(ctrls[i].type == 'tagsinput'){
            tagsinput_listener(ctrls[i]);
        } else if (ctrls[i].type == 'files'){
            file_listener(ctrls[i]);
        };
    };
};

function chipsonclick(thisele,ctrl){
    let tag_value = $(thisele).data('data');
    record_files_or_tags[ctrl.id].splice(record_files_or_tags[ctrl.id].indexOf(tag_value),1);
    tagsreflash(ctrl);
}
function tagsreflash(ctrl){
    //let tagshtml = '';
    $(`#${ctrl.id} .complex-con-list`).empty();
    for(let i = 0;i < record_files_or_tags[ctrl.id].length;i++){
        if(ctrl.type == 'files'){
            let tagshtml;
            if(record_files_or_tags[ctrl.id][i][2] === ''){
                tagshtml = `<mdui-chip>${record_files_or_tags[ctrl.id][i][0]}</mdui-chip>`;
            } else {
                tagshtml = `<mdui-chip>${record_files_or_tags[ctrl.id][i][2]}</mdui-chip>`;
            };
            $(`#${ctrl.id} .complex-con-list`).append(tagshtml);
            $(`#${ctrl.id} .complex-con-list > :last-child`).data('data',record_files_or_tags[ctrl.id][i]);
        } else {
            let tagshtml = `<mdui-chip>${record_files_or_tags[ctrl.id][i]}</mdui-chip>`;
            $(`#${ctrl.id} .complex-con-list`).append(tagshtml);
            $(`#${ctrl.id} .complex-con-list > :last-child`).data('data',record_files_or_tags[ctrl.id][i]);
        };
    };
    //$(`#${ctrl.id} .complex-con-list`).html(tagshtml);
    $(`#${ctrl.id} .complex-con-list mdui-chip`).on('click',function(){chipsonclick(this,ctrl);});
};
function tagsinput_listener(ctrl){
    $(`#${ctrl.id} .complex-con-controls mdui-button`).on('click',function(){
        let tag_value = $(`#${ctrl.id} .complex-con-controls mdui-text-field`).val();
        $(`#${ctrl.id} .complex-con-controls mdui-text-field`).val('');
        if(tag_value != ''){
            record_files_or_tags[ctrl.id].push(tag_value);
        };
        tagsreflash(ctrl);
        $(`#${ctrl.id} .complex-con-controls mdui-text-field`).focus();
    });
};


function uploadfile(event, ctrl){
    return new Promise((resolve, reject) => {
        const promises = [];
        for (let i = 0; i < event.target.files.length; i++) {
            let file = event.target.files[i];
            if (file.size <= 100 * 1024 * 1024) {
                let formdata = new FormData();
                formdata.append('file', file);
                promises.push(
                    new Promise((resolve, reject) => {
                        $.ajax({
                            url: upload_to,
                            type: 'POST',
                            data: formdata,
                            processData: false,
                            contentType: false,
                            success: function (res) {
                                record_files_or_tags[ctrl.id].push([file.name, res.filename]);
                                resolve();
                            },
                            error: function () {
                                mdui.snackbar({ message: '上传失败', closeable: true });
                                reject();
                            },
                        });
                    })
                );
            } else {
                mdui.snackbar({ message: '文件过大，已跳过', closeable: true });
            }
        };
        Promise.all(promises)
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject();
            });
    });
}
async function file_listener(ctrl) {
    record_files_or_tags[ctrl.id] = [];
    $(`#${ctrl.id} .complex-con-controls mdui-button`).on('click', async function (){
        if(ctrl.config.accept){
            fileinput.accept = ctrl.config.accept;
        } else {
            fileinput.accept = '';
        };
        fileinput.value = '';
        fileinput.click();
        fileinput.onchange = async function (event) {
            $('.upload-dialog').attr('open', '');
            await uploadfile(event, ctrl);
            $('.upload-dialog').removeAttr('open');
            for(let i = 0; i < record_files_or_tags[ctrl.id].length; i++){
                if(record_files_or_tags[ctrl.id][i].length === 2){
                    record_files_or_tags[ctrl.id][i].push(
                        $(`#${ctrl.id} .complex-con-controls mdui-text-field`).val() || ''
                    );
                };
            };
            tagsreflash(ctrl);
        };
    });
};


function get_result_obj(){
    let completed = true;
    let result = {};
    let firstnotcompleted = null;
    for(let i = 0;i<ctrls.length;i++){
        let ctrl = ctrls[i];
        let value;
        switch(ctrl.type){
            case 'text':
            case 'textarea':
            case 'radios':
            case 'select':
                value = $(`#${ctrl.id}`).val();
                result[ctrl.id] = value;
                if(value === '' && ctrl.req){
                    completed = false;
                    if(!firstnotcompleted){
                        firstnotcompleted = ctrl.id;
                    };
                };
                break;
            case 'tagsinput':
                if(ctrl.config.pinnedtags){
                    value = $(`#${ctrl.id}`).val();
                }else{
                    value = record_files_or_tags[ctrl.id];
                };
                result[ctrl.id] = value;
                if(value == [] && ctrl.req){
                    completed = false;
                    if(!firstnotcompleted){
                        firstnotcompleted = ctrl.id;
                    };
                };
                break;
            case 'checkboxs':
                value = $(`#${ctrl.id}`).prop('checked');
                result[ctrl.id] = value;
                break;
            case 'files':
                value = record_files_or_tags[ctrl.id];
                result[ctrl.id] = value;
                if(value == [] && ctrl.req){
                    completed = false;
                    if(!firstnotcompleted){
                        firstnotcompleted = ctrl.id;
                    };
                };
                break;
            case 'table':
                value = {}
                for(let i = 0;i<ctrl.config.row.length;i++){
                    let valuethis = $(`#${ctrl.id}`).children('mdui-segmented-button-group').eq(i);
                    value[ctrl.config.row[i]] = valuethis.val();
                    if(value == '' && ctrl.req){
                        completed = false;
                        if(!firstnotcompleted){
                            firstnotcompleted = ctrl.id;
                        };
                    };
                };
                result[ctrl.id] = value;
        };
    };
    return [result, completed, firstnotcompleted];
};

function auto_save_processing(){
    let autosaved = JSON.parse(localStorage.getItem(`Form-${sha256(form_source)}`));
    if(autosaved != null){
        $('.autosave-dialog').attr('open','');
        $('.autosave-dialog [variant="tonal"]').on('click',function(){
            $('.autosave-dialog').removeAttr('open');
            for(let id in autosaved){
                let type = ctrls.find(obj => obj.id == id).type;
                switch(type){
                    case 'text':
                    case 'textarea':
                    case 'radios':
                    case 'select':
                        $(`#${id}`).val(autosaved[id]);
                        break;
                    case 'tagsinput':
                        let ispinned = ctrls.find(obj => obj.id == id).config.pinnedtags;
                        if(ispinned){
                            $(`#${id}`).val(autosaved[id]);
                        }else{
                            record_files_or_tags[id] = autosaved[id];
                            tagsreflash({id:id,type:'tagsinput'});
                        };
                        break;
                    case 'checkboxs':
                        $(`#${id}`).prop('checked',autosaved[id]);
                        break;
                    case 'files':
                        record_files_or_tags[id] = autosaved[id];
                        tagsreflash({id:id,type:'files'});
                        break;
                    case 'table':
                        let content = autosaved[id];
                        let i = 0;
                        for(let key in content){
                            $(`#${id}`).children('mdui-segmented-button-group').eq(i).val(content[key]);
                            i++;
                        };
                        break;
                };
            };
        });
    };
};

function uploadform(result){
    return new Promise((resolve, reject) => {
        $.ajax({
            url: send_to,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify([form_source,result,user_code,sha256(form_source)]),
            success: function(){mdui.snackbar({ message: '成功', closeable: true });;resolve();},
            error: function(){mdui.snackbar({ message: '失败', closeable: true });;reject();}
        });
    });
};
async function submiting(){
    let callback = get_result_obj();
    if(callback[1]){
        if(eval(verify_code)){
            $('.upload-dialog').attr('open', '');
            await uploadform(callback[0]);
            $('.upload-dialog').removeAttr('open');
            if(norep){
                $('.submit-btn').remove();
                let old_val_ls = localStorage.getItem('Form-norep') || '[]';
                old_val_ls = JSON.parse(old_val_ls);
                old_val_ls.push(sha256(form_source));
                localStorage.setItem('Form-norep',JSON.stringify(old_val_ls));
            };
        }else{
            mdui.snackbar({ message: '自定义的规则未通过', closeable: false });
        };
    } else {
        mdui.snackbar({ message: '还有未填写的内容', closeable: false });
        $(`#${callback[2]}`).focus();
    };
};

var user_code = []; //[ip,fp]
async function no_repeat(){
    let rep_records = localStorage.getItem('Form-norep') || [];
    let this_form_id = sha256(form_source);
    if(rep_records.includes(this_form_id)){
        mdui.alert({
            headline: "重复访问！",
            description: "不能重复提交第二次",
            confirmText: "知道了",
            onConfirm: () => {
                $('body').html('<div style="background-color: #6060ff;color: white;font-size: 150px;padding: 20px;width: 100%;height: 100%;box-sizing: border-box;"">:)</div>');
                // 好有病啊
            },
        });
    };
    let ip = await fetch('https://checkip.amazonaws.com/');
    if(!ip.ok){user_code.push(null)}else{
        ip = await ip.text();
        ip = ip.replace(/\n/g,'');
        user_code.push(ip);
    };
    /*
    try{
        user_code.push((document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl')).getParameter((document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl')).RENDERER));
    }catch{
        user_code.push(null);
    };
    */
    let fp_result = '';
    await FingerprintJS.load().then(async fp => {
        await fp.get().then(result => {
            fp_result = result.visitorId;
        });
    });
    user_code.push(fp_result);
    //console.log(user_code)
    $.ajax({
        url: norep_ask,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify([this_form_id,user_code]),
        success: function(response){
            if(response[0] == true){
                mdui.alert({
                    headline: "重复访问！",
                    description: "不能重复提交第二次",
                    confirmText: "知道了",
                    onConfirm: () => {
                        $('body').html('<div style="background-color: #6060ff;color: white;font-size: 150px;padding: 20px;width: 100%;height: 100%;box-sizing: border-box;"">:)</div>');
                        // 6
                    },
                });
            };
        }
    });
};

