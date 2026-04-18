import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/+esm';
import defaults from "./defaults.js";

const monacoEditor = monaco.editor.create(document.getElementById('editor'), {
    value: defaults.template,
    language: 'markdown',
    theme: 'vs-light',
    automaticLayout: false,
    minimap: { enabled: false }
});