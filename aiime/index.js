
const e_menu_new = document.querySelector('.menu-new');
const e_menu_open = document.querySelector('.menu-open');
const e_menu_save = document.querySelector('.menu-save');
const e_modeswitch = document.querySelector('.menu-swich');
const e_menu_setting = document.querySelector('.menu-setting');

var is_ai_mode = false;

e_modeswitch.addEventListener('click', function() {
    is_ai_mode = !is_ai_mode;
    if(is_ai_mode) {
        e_modeswitch.textContent = 'AI已开启';
        e_modeswitch.classList.add('switch-on');
        e_modeswitch.classList.remove('switch-off');
    } else {
        e_modeswitch.textContent = 'AI已关闭';
        e_modeswitch.classList.remove('switch-on');
        e_modeswitch.classList.add('switch-off');
    };
});