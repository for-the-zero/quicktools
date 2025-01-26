const nele_cvs = document.querySelector('#canvas');
const ctx = nele_cvs.getContext('2d');
var text = '';
var fontc = '#000000';
var bgc = '#FFFFFF';
var mode = 'full';

function draw_text(ctx, text, x, y, width, height) {
    if (text.length > 0 && text.trim().length > 0) {
        let font_family = 'Google Sans,Noto Sans SC';
        let font_size = '200';
        let text_lines = [];
        let text_line = '';
        let chars = text.split('');
        let line_height = 0;
        let lines_height = 0;
        while (font_size > 1) {
            text_lines = [];
            text_line = '';
            ctx.font = `${font_size}px ${font_family}`;
            for (let char of chars) {
                if (char == '\n') {
                    text_lines.push(text_line);
                    text_line = '';
                }
                else if (ctx.measureText(text_line + char).width > width) {
                    text_lines.push(text_line);
                    text_line = char;
                } else {
                    text_line += char;
                };
            };
            text_lines.push(text_line);
            line_height = ctx.measureText('哈').width * 1.5;
            lines_height = line_height * text_lines.length;
            if (lines_height > height) {
                font_size -= 1;
            } else {
                break;
            };
        };
        font_size -= 1;
        ctx.font = `${font_size}px ${font_family}`;
        text_lines = [];
        text_line = '';
        for (let char of chars) {
            if (char == '\n') {
                text_lines.push(text_line);
                text_line = '';
            }
            else if (ctx.measureText(text_line + char).width > width) {
                text_lines.push(text_line);
                text_line = char;
            } else {
                text_line += char;
            };
        };
        text_lines.push(text_line);
        line_height = ctx.measureText('哈').width * 1.5;
        lines_height = line_height * text_lines.length;
        ctx.textBaseline = 'top';
        for (let i = 0; i < text_lines.length; i++) {
            ctx.fillText(text_lines[i], x + (width - ctx.measureText(text_lines[i]).width) / 2, y + i * line_height + (height - lines_height) / 2);
        };
    };
};

if(window.innerWidth < window.innerHeight){
    nele_cvs.width = window.innerHeight * 1.5;
    nele_cvs.height = window.innerWidth * 1.5;
} else {
    nele_cvs.width = window.innerWidth * 1.5;
    nele_cvs.height = window.innerHeight * 1.5;
};
window.addEventListener('resize',function(){
    if(window.innerWidth < window.innerHeight){
        nele_cvs.width = window.innerHeight * 1.5;
        nele_cvs.height = window.innerWidth * 1.5;
    } else {
        nele_cvs.width = window.innerWidth * 1.5;
        nele_cvs.height = window.innerHeight * 1.5;
    };
    if(mode == 'full'){
        draw();
    } else if(mode == 'scroll'){
        calc_scroll();
    };
});

window.addEventListener('message', function(e){
    let data = e.data;
    text = data.text;
    fontc = data.fontc;
    bgc = data.bgc;
    mode = data.mode;
    if(mode == 'scroll'){
        calc_scroll();
    };
    draw();
});

var scroll_fontsize = 200;
var scroll_width = 0;
var scroll_process = 0;
function calc_scroll(){
    //TODO:
};

function draw(){
    ctx.clearRect(0,0,nele_cvs.width,nele_cvs.height);
    ctx.fillStyle = bgc;
    ctx.fillRect(0,0,nele_cvs.width,nele_cvs.height);
    ctx.fillStyle = fontc;
    if(mode == 'full'){
        draw_text(ctx, text, 0, 0, nele_cvs.width, nele_cvs.height);
    } else if(mode == 'scroll'){
        requestAnimationFrame(draw);
    };
};