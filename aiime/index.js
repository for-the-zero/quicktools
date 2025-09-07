
const e_menu_new = document.querySelector('.menu-new');
const e_menu_open = document.querySelector('.menu-open');
const e_menu_save = document.querySelector('.menu-save');
const e_modeswitch = document.querySelector('.menu-swich');
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
        } else {
            show_setting();
        };
    } else {
        e_modeswitch.textContent = 'AI已关闭';
        e_modeswitch.classList.remove('switch-on');
        e_modeswitch.classList.add('switch-off');
    };
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
            //TODO:
        } else if(e.key === 'Alt'){
            e.preventDefault();
        };
    };
});