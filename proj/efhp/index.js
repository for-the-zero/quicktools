import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/+esm';
import defaults from "./defaults.js";
import get_mdtable from './get_mdtable.js';

var config = defaults;

if(localStorage.getItem('efhp') && JSON.parse(localStorage.getItem('efhp'))){
    config.template = JSON.parse(localStorage.getItem('efhp')).template;
    config.url = JSON.parse(localStorage.getItem('efhp')).url;
};

document.getElementById('data-recipe').value = config.url[0];
document.getElementById('data-i18n').value = config.url[1];
const editor = monaco.editor.create(document.getElementById('editor'), {
    value: config.template,
    language: 'markdown',
    theme: 'vs-light',
    automaticLayout: false,
    minimap: { enabled: false }
});

document.querySelector('.dia-close').addEventListener('click', ()=>{
    document.querySelector('.dia').classList.remove('open');
});

document.querySelector('.btn-reset').addEventListener('click', ()=>{
    config = {...defaults};
    editor.setValue(config.template);
    document.getElementById('data-recipe').value = config.url[0];
    document.getElementById('data-i18n').value = config.url[1];
});
document.querySelector('.btn-save-config').addEventListener('click', ()=>{
    if(!editor.getValue().includes('{{ recipes }}')){
        document.querySelector('.dia-content').innerHTML = '编辑器内需要有{{ recipes }}';
        document.querySelector('.dia').classList.add('open');
        return;
    };
    localStorage.setItem('efhp', JSON.stringify({
        template: editor.getValue(),
        url: [document.getElementById('data-recipe').value, document.getElementById('data-i18n').value]
    }))
});
document.querySelector('.btn-fill-recipe').addEventListener('click', async()=>{
    if(!editor.getValue().includes('{{ recipes }}')){
        document.querySelector('.dia-content').innerHTML = '编辑器内需要有{{ recipes }}';
        document.querySelector('.dia').classList.add('open');
        return;
    };
    let cb = await get_mdtable(config.url[0], config.url[1]);
    editor.setValue(editor.getValue().replaceAll('{{ recipes }}', cb[1]).replaceAll('{{ version }}', cb[0]));
});

document.querySelector('.btn-save-copy').addEventListener('click', ()=>{
    navigator.clipboard.writeText(editor.getValue());
});
document.querySelector('.btn-save-md').addEventListener('click', ()=>{
    let a = document.createElement('a');
    a.download = '提示词.md';
    a.href = URL.createObjectURL(new Blob([editor.getValue()]));
    a.click();
    URL.revokeObjectURL(a.href);
    document.querySelector('.dia-content').innerHTML = '已开始下载';
    document.querySelector('.dia').classList.add('open');
});