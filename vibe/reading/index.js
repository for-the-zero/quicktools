const App = {
    words: [],
    segments: [],
    originalText: '',
    currentIndex: 0,
    isPlaying: false,
    mode: 'word',
    speed: 300,
    timer: null,
    segmenter: null,

    init() {
        this.initSegmenter();
        this.bindEvents();
        this.loadColors();
    },

    initSegmenter() {
        if (window.Intl && Intl.Segmenter) {
            this.segmenter = new Intl.Segmenter('zh', { granularity: 'word' });
        }
    },

    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => this.startReading());
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('stop-btn').addEventListener('click', () => this.stopReading());
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFile(e));

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setMode(e.target.dataset.mode));
        });

        const speedSlider = document.getElementById('speed-slider');
        speedSlider.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            document.getElementById('speed-value').textContent = this.speed;
        });

        const readerSpeed = document.getElementById('reader-speed');
        let speedDebounceTimer = null;
        readerSpeed.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            document.getElementById('reader-speed-value').textContent = this.speed;
            if (speedDebounceTimer) {
                clearTimeout(speedDebounceTimer);
            }
            speedDebounceTimer = setTimeout(() => {
                if (this.isPlaying) {
                    this.resetTimer();
                }
            }, 100);
        });

        const progressSlider = document.getElementById('progress-slider');
        progressSlider.addEventListener('input', (e) => {
            this.currentIndex = parseInt(e.target.value);
            this.updateDisplay();
        });

        document.getElementById('bg-color').addEventListener('change', (e) => {
            document.documentElement.style.setProperty('--bg-color', e.target.value);
            this.saveColors();
        });

        document.getElementById('text-color').addEventListener('change', (e) => {
            document.documentElement.style.setProperty('--text-color', e.target.value);
            this.saveColors();
        });
    },

    setMode(mode) {
        this.mode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
    },

    segmentText(text) {
        this.originalText = text;
        if (this.segmenter) {
            const segments = Array.from(this.segmenter.segment(text));
            this.segments = segments
                .map((s, index) => ({
                    text: s.segment,
                    index: index,
                    isWordLike: s.isWordLike,
                    start: s.index
                }))
                .filter(s => s.isWordLike || /\S/.test(s.text));
            return this.segments.map(s => s.text);
        }

        const words = text
            .replace(/([.!?。！？])/g, '$1|')
            .split(/\s+|\|/)
            .map(w => w.trim())
            .filter(w => w.length > 0);
        this.segments = words.map((w, i) => ({ text: w, index: i }));
        return words;
    },

    async handleFile(e) {
        const file = e.target.files[0];
        if (!file) return;

        const ext = file.name.split('.').pop().toLowerCase();

        try {
            if (ext === 'epub') {
                await this.readEpub(file);
            } else {
                await this.readTxt(file);
            }
        } catch (err) {
            alert('文件读取失败: ' + err.message);
        }

        e.target.value = '';
    },

    readTxt(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('text-input').value = e.target.result;
                resolve();
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    },

    async readEpub(file) {
        const data = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(data);

        let text = '';
        const htmlFiles = [];

        zip.forEach((path, file) => {
            if (path.endsWith('.html') || path.endsWith('.xhtml') || path.endsWith('.htm')) {
                htmlFiles.push(file);
            }
        });

        htmlFiles.sort((a, b) => a.name.localeCompare(b.name));

        for (const file of htmlFiles) {
            const content = await file.async('text');
            const div = document.createElement('div');
            div.innerHTML = content;
            text += div.textContent + '\n';
        }

        document.getElementById('text-input').value = text.trim();
    },

    startReading() {
        const text = document.getElementById('text-input').value.trim();
        if (!text) {
            alert('请输入或导入文本');
            return;
        }

        this.words = this.segmentText(text);
        if (this.words.length === 0) {
            alert('未能识别有效文本');
            return;
        }

        this.currentIndex = 0;
        this.isPlaying = true;

        document.getElementById('setup-panel').classList.add('hidden');
        document.getElementById('reader-panel').classList.remove('hidden');

        const progressSlider = document.getElementById('progress-slider');
        progressSlider.max = this.words.length - 1;
        progressSlider.value = 0;

        document.getElementById('reader-speed').value = this.speed;
        document.getElementById('reader-speed-value').textContent = this.speed;

        this.updateDisplay();
        this.play();
    },

    play() {
        if (!this.isPlaying) return;
        this.nextWord();
    },

    nextWord() {
        if (!this.isPlaying) return;

        const interval = 60000 / this.speed;

        this.timer = setTimeout(() => {
            if (this.currentIndex >= this.words.length - 1) {
                this.pause();
                return;
            }
            this.currentIndex++;
            this.updateDisplay();
            this.nextWord();
        }, interval);
    },

    pause() {
        this.isPlaying = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        document.getElementById('pause-btn').textContent = '继续';
    },

    resume() {
        this.isPlaying = true;
        document.getElementById('pause-btn').textContent = '暂停';
        this.play();
    },

    togglePause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.resume();
        }
    },

    stopReading() {
        this.pause();
        this.currentIndex = 0;
        document.getElementById('setup-panel').classList.remove('hidden');
        document.getElementById('reader-panel').classList.add('hidden');
    },

    resetTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        if (this.isPlaying) {
            this.nextWord();
        }
    },

    getORPIndex(word) {
        const len = word.length;
        if (len <= 3) return 0;
        if (len <= 5) return 1;
        if (len <= 9) return 2;
        return 3;
    },

    formatRSVPWord(word) {
        const orpIndex = this.getORPIndex(word);
        const before = word.slice(0, orpIndex);
        const orp = word[orpIndex] || '';
        const after = word.slice(orpIndex + 1);

        const maxChars = 16;
        const beforeWidth = (maxChars / 2) + 'ch';
        const afterWidth = (maxChars / 2) + 'ch';

        return `<span class="rsvp-word"><span class="before" style="width: ${beforeWidth}; text-align: right;">${before}</span><span class="orp">${orp}</span><span class="after" style="width: ${afterWidth}; text-align: left;">${after}</span></span>`;
    },

    updateDisplay() {
        const display = document.getElementById('word-display');
        const progressSlider = document.getElementById('progress-slider');
        const progressText = document.getElementById('progress-text');

        progressSlider.value = this.currentIndex;
        progressText.textContent = `${this.currentIndex + 1} / ${this.words.length}`;

        if (this.mode === 'rsvp') {
            display.className = 'rsvp-mode';
            const word = this.words[this.currentIndex];
            display.innerHTML = this.formatRSVPWord(word);
        } else {
            display.className = 'word-mode';
            const currentSegment = this.segments[this.currentIndex];
            if (currentSegment) {
                const endPos = currentSegment.start + currentSegment.text.length;
                display.textContent = this.originalText.slice(0, endPos);
            }
            display.scrollTop = display.scrollHeight;
        }
    },

    saveColors() {
        const bg = document.getElementById('bg-color').value;
        const text = document.getElementById('text-color').value;
        localStorage.setItem('reader-bg', bg);
        localStorage.setItem('reader-text', text);
    },

    loadColors() {
        const bg = localStorage.getItem('reader-bg') || '#1a1a2e';
        const text = localStorage.getItem('reader-text') || '#eaeaea';

        document.documentElement.style.setProperty('--bg-color', bg);
        document.documentElement.style.setProperty('--text-color', text);
        document.getElementById('bg-color').value = bg;
        document.getElementById('text-color').value = text;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});