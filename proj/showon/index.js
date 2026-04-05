document.addEventListener('DOMContentLoaded', function() {
    const nele_text = document.querySelector('md-outlined-text-field');
    const nele_fontc = document.querySelector('.font-color');
    const nele_bgc = document.querySelector('.background-color');
    const nele_modef = document.querySelector('#full');
    const nele_start = document.querySelector('.start-btn');

    nele_modef.click();
    nele_start.addEventListener('click', function(){
        let text = nele_text.value;
        let fontc = nele_fontc.value;
        let bgc = nele_bgc.value;
        let mode = nele_modef.shadowRoot.querySelector('div.container').classList.contains('checked')? 'full' : 'scroll';

        let new_window = window.open('show.html','_blank','popup,width=400,height=200');
        new_window.addEventListener('load', function(){
            new_window.postMessage({text: text, fontc: fontc, bgc: bgc, mode: mode},'*');
        });
    });
});