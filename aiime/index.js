
const e_menu_new = document.querySelector('.menu-new');
const e_menu_open = document.querySelector('.menu-open');
const e_menu_save = document.querySelector('.menu-save');
const e_modeswitch = document.querySelector('.menu-switch');
const e_menu_setting = document.querySelector('.menu-setting');

const e_editor = document.querySelector('.editor');
const e_imelist = document.querySelector('.ime');

const e_musk = document.querySelector('.elon');
const e_asking = document.querySelector('.asking');
const e_asking_input = document.querySelector('.asking input');
const e_asking_p = document.querySelector('.asking p');

const e_setting = document.querySelector('.setting');
const e_setting_burl = document.querySelector('.setting-burl');
const e_setting_key = document.querySelector('.setting-key');
const e_setting_model = document.querySelector('.setting-model');
const e_setting_pmt_editor = document.querySelector('.setting-pmt1');
const e_setting_pmt_asking = document.querySelector('.setting-pmt2');
const e_setting_default = document.querySelector('.setting-default');
const e_setting_save = document.querySelector('.setting-save');

const default_setting = {
    burl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    key: '',
    model: 'gemini-2.5-flash-lite',
    pmt_editor: `你是一个拼音输入法的核心，根据上下文内容以及用户输入的字符给出候选词
- 用户输入的字符可能是全拼、英语、首拼中的一种或多种杂糅
- 你需要快速分析用户可能想要输入的内容，转成中文（可以含有英文）
- 用户可能有按错键盘的情况，如按到了相邻按键、字母顺序错误、漏打多打按键等
- 需要处理模糊拼音如翘舌音和后鼻音
- 你只支持中文和英文，不允许输出其它语言
- 每个候选词必须完整对应所有用户输入的字符，不能遗漏
- 先对分词和容错分析较难的地方进行及其简短且简单的分析，然后在JSON代码块给出一个JSON数组
- 数组中每个元素是一个字符串，输出结果示例：\`["填写","天蝎","天线"]\`
- 候选词要展现尽可能多的可能性，且至少3个`,
    pmt_asking: `你是一个写作辅助助手，解答用户提出的问题解答
用户输入的可能是正常句子如\`第一个航天员\`和\`面积最大的国家是哪个\`，也可能是杂乱的字母
**用户输入的是正常句子**
直接开始解答
**用户输入的是杂乱的字母**
- 需要转换成正常句子再开始解答
- 这些字符可能是全拼、英语、首拼中的一种或多种杂糅
- 你需要快速分析用户可能想要输入的内容
- 可能需要处理按错键盘和模糊拼音，也要注意如"谁"拼成"shei/shui"等情况
- 转换结果必须完整对应所有用户输入的字符
- 需要进行及其简短且简单的分析并写出来
- 写出转换结果再以转换结果为问题开始解答
**解答**
- 得到正常句子后，你需要把握用户真实意图，给出解答，例如上面两个问题的解答分别是\`尤里·加加林\`和\`俄罗斯\`
- 输出结果必须简短准确，一般为一个词语或短句
- 最后在JSON代码块中，用\`{"result":"结果"}\`的格式给出输出结果`
};

var is_ai_mode = false;
var setting = {...default_setting};

function debounce(func, delay) {
    let timer = null;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        };
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

if(localStorage.getItem('aiime')){
    setting = JSON.parse(localStorage.getItem('aiime'));
    localStorage.setItem('aiime', JSON.stringify(setting));
};
e_setting_burl.value = setting.burl;
e_setting_key.value = setting.key;
e_setting_model.value = setting.model;
e_setting_pmt_editor.value = setting.pmt_editor;
e_setting_pmt_asking.value = setting.pmt_asking;
e_menu_setting.addEventListener('click',show_setting);
function show_setting(){
    e_musk.classList.remove('elon-hide');
    e_musk.classList.add('elon-show');
    e_setting.classList.remove('setting-hide');
};
function hide_setting(){
    e_musk.classList.add('elon-hide');
    e_musk.classList.remove('elon-show');
    e_setting.classList.add('setting-hide');
};
e_setting_save.addEventListener('click', ()=>{
    setting.burl = e_setting_burl.value;
    setting.key = e_setting_key.value;
    setting.model = e_setting_model.value;
    setting.pmt_editor = e_setting_pmt_editor.value;
    setting.pmt_asking = e_setting_pmt_asking.value;
    localStorage.setItem('aiime', JSON.stringify(setting));
    hide_setting();
});
e_setting_default.addEventListener('click', ()=>{
    e_setting_burl.value = default_setting.burl;
    e_setting_key.value = default_setting.key;
    e_setting_model.value = default_setting.model;
    e_setting_pmt_editor.value = default_setting.pmt_editor;
    e_setting_pmt_asking.value = default_setting.pmt_asking;
});

e_modeswitch.addEventListener('click', ()=>{
    is_ai_mode = !is_ai_mode;
    if(is_ai_mode) {
        if(setting.burl && setting.key && setting.model && setting.pmt_editor && setting.pmt_asking){
            e_modeswitch.textContent = 'AI已开启';
            e_modeswitch.classList.add('switch-on');
            e_modeswitch.classList.remove('switch-off');
            last_confirmed_pos = e_editor.selectionStart;
        } else {
            show_setting();
        };
    } else {
        e_modeswitch.textContent = 'AI已关闭';
        e_modeswitch.classList.remove('switch-on');
        e_modeswitch.classList.add('switch-off');
    };
});

e_menu_new.addEventListener('click', ()=>{
    if(confirm('是否清空编辑器内容？')){
        e_editor.value = '';
        e_editor.focus();
    };
});
e_menu_open.addEventListener('click', ()=>{
    let select_ele = document.createElement('input');
    select_ele.type = 'file';
    select_ele.addEventListener('change', (e)=>{
        let file = e.target.files[0];
        if(!file){
            select_ele.remove();
            return;
        };
        if(file.size > 1024*5){
            if(!confirm('文件大小超过5KB，是否继续？')){
                select_ele.remove();
                return;
            };
        };
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e)=>{
            let content = e.target.result;
            e_editor.value = content;
            e_editor.focus();
        };
        select_ele.remove();
    });
    select_ele.click();
});
e_menu_save.addEventListener('click', ()=>{
    let content = e_editor.value;
    let a = document.createElement('a');
    a.download = 'Untitled.txt';
    a.href = URL.createObjectURL(new Blob([content]));
    a.click();
    URL.revokeObjectURL(a.href);
});

var is_asking_mode = false;
function show_asking(){
    e_asking.classList.remove('asking-hide');
    e_musk.classList.add('elon-show');
    e_musk.classList.remove('elon-hide');
    e_asking_input.value = '';
    e_asking_p.textContent = '……';
    e_asking_input.focus();
};
function hide_asking(){
    e_asking.classList.add('asking-hide');
    e_musk.classList.remove('elon-show');
    e_musk.classList.add('elon-hide');
    e_editor.focus();
};
document.addEventListener('keydown', (e)=>{
    if (e.altKey){
        if(e.key.toLowerCase() === 'x'){
            e.preventDefault();
            if(is_asking_mode){
                is_asking_mode = false;
                hide_asking();
            } else {
                is_asking_mode = true;
                show_asking();
            };
        } else if(/^[1-9]$/.test(e.key)){
            e.preventDefault();
            confirm_ime(e.key);
        } else if(e.key === 'Alt'){
            e.preventDefault();
        };
    };
});

var asking_result = '';
const asking_request = debounce(() => {
    const input = e_asking_input.value;
    if(input){
        asking_result = '';
        e_asking_p.textContent = '(请求中)';
        fetch(setting.burl + '/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + setting.key,
            },
            body: JSON.stringify({
                model: setting.model,
                stream: false,
                messages:[
                    { role: 'system', content: setting.pmt_asking },
                    { role: 'user', content: input }
                ]
            })
        }).then((response)=>{
            if (!response.ok || response.status !== 200) {
                console.error(response);
                e_asking_p.textContent = '请求失败，详细信息请查看控制台';
                return;
            };
            return response.json();
        }).then((data)=>{
            //console.log(data);
            let answer = data.choices[0].message.content;
            console.log(answer);
            const code_block = answer.match(/```json\n([\s\S]*?)\n```/);
            if(code_block){
                answer = code_block[1];
            };
            try{
                let result = JSON.parse(answer).result;
                console.log(result);
                if(result){
                    asking_result = result;
                    e_asking_p.textContent = result;
                } else {
                    e_asking_p.textContent = '无结果';
                };
            }catch(e){
                e_asking_p.textContent = '无结果';
            };
        }).catch((error)=>{
            console.error(error);
            e_asking_p.textContent = '请求失败，详细信息请查看控制台';
        });
    };
}, 1000);
e_asking_input.addEventListener('input', asking_request);
e_asking_input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
        e.preventDefault();
        e_editor.focus();
        let editor_value = e_editor.value;
        let cursor_pos = e_editor.selectionStart;
        e_editor.value = editor_value.substring(0, cursor_pos) + asking_result + editor_value.substring(cursor_pos);
        hide_asking();
    } else if(e.key === 'Escape'){
        e.preventDefault();
        hide_asking();
    };
});

var last_confirmed_pos = 0;
var ime_list = [];
function create_div(text){
    let div = document.createElement('div');
    div.textContent = text;
    return div;
};
const ime_request = debounce(() => {
    if (last_confirmed_pos > e_editor.selectionStart) {
        last_confirmed_pos = e_editor.selectionStart;
        e_imelist.innerHTML = '';
        ime_list = [];
        return;
    };
    let now_writting = e_editor.value.slice(last_confirmed_pos, e_editor.selectionStart);
    if(now_writting.length > 1){
        let user_pmt = ``;
        if(now_writting !== e_editor.value){
            user_pmt += `<---上下文--->\n\n${e_editor.value}\n\n`;
        };
        user_pmt += `<---当前输入--->\n${now_writting}`;
        fetch(setting.burl + '/chat/completions',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + setting.key,
            },
            body: JSON.stringify({
                model: setting.model,
                stream: false,
                messages:[
                    { role: 'system', content: setting.pmt_editor },
                    { role: 'user', content: user_pmt }
                ],
            })
        }).then((response)=>{
            if (!response.ok || response.status !== 200) {
                console.error(response);
                e_imelist.innerHTML = '';
                ime_list = [];
                e_imelist.appendChild(create_div('请求失败，详细信息请查看控制台'));
                return;
            };
            return response.json();
        }).then((data)=>{
            //console.log(data);
            let answer = data.choices[0].message.content;
            console.log(answer);
            const code_block = answer.match(/```json\n([\s\S]*?)\n```/);
            if(code_block){
                answer = code_block[1];
            };
            try{
                let result = JSON.parse(answer);
                if(!(result.length > 0)){throw new Error('不是数组');};
                console.log(result);
                e_imelist.innerHTML = '';
                ime_list = [...result];
                e_imelist.appendChild(create_div(now_writting));
                for(let i=0;i<ime_list.length;i++){
                    e_imelist.appendChild(create_div(ime_list[i]));
                };
            }catch(e){
                e_imelist.innerHTML = '';
                ime_list = [];
                e_imelist.appendChild(create_div('无结果'));
            };
        }).catch((error)=>{
            console.error(error);
            e_imelist.innerHTML = '';
            ime_list = [];
            e_imelist.appendChild(create_div('请求失败，详细信息请查看控制台'));
        });
    };
}, 500);
e_editor.addEventListener('input', ()=>{
    if(!e_editor.value){
        e_imelist.innerHTML = '';
        ime_list = [];
        last_confirmed_pos = 0;
        return;
    };
    last_cursor_pos = e_editor.selectionStart;
    if(is_ai_mode){
        ime_request();
    };
});
function confirm_ime(index) {
    index = parseInt(index);
    if (index < 1 || index > 9) {
        return;
    };
    const editor_value = e_editor.value;
    const cursor_pos = e_editor.selectionStart;
    if (index === 1) {
        last_confirmed_pos = cursor_pos;
        e_imelist.innerHTML = '';
        ime_list = [];
        return;
    };
    if (index - 2 < 0 || index - 2 >= ime_list.length) {
        return;
    };
    const selected_text = ime_list[index - 2];
    const new_text = editor_value.substring(0, last_confirmed_pos) + selected_text + editor_value.substring(cursor_pos);
    e_editor.value = new_text;
    const new_cursor_pos = last_confirmed_pos + selected_text.length;
    e_editor.setSelectionRange(new_cursor_pos, new_cursor_pos);
    last_confirmed_pos = new_cursor_pos;
    e_imelist.innerHTML = '';
    ime_list = [];
};

let last_cursor_pos = 0;
e_editor.addEventListener('mouseup', () => {
    if(is_ai_mode){
        setTimeout(() => {
            const current_pos = e_editor.selectionStart;
            if(current_pos !== last_cursor_pos){
                last_confirmed_pos = current_pos;
                last_cursor_pos = current_pos;
                e_imelist.innerHTML = '';
                ime_list = [];
            };
        }, 50);
    };
});
e_editor.addEventListener('keyup', (e) => {
    if(is_ai_mode && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown')){
        const current_pos = e_editor.selectionStart;
        if(current_pos !== last_cursor_pos){
            last_confirmed_pos = current_pos;
            last_cursor_pos = current_pos;
            e_imelist.innerHTML = '';
            ime_list = [];
        };
    };
});