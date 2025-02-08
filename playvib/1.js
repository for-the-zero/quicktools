// 初始化音频元素
var audio_1 = new Audio();
audio_1.src = 'bestmusic.mp3';
audio_1.load();

var audio_2 = new Audio();
audio_2.src = 's.mp3';
audio_2.load();

var audio_s; // 动态加载的音频

$('.music-loading').remove();

$('.music-file').on('change', function(e) {
    e.preventDefault();
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        audio_s = new Audio(e.target.result);
        audio_s.load();
    };
    reader.readAsDataURL(file);
});

// 存储AudioContext实例
let audCtx;

function createOrResumeAudioContext() {
    if (!audCtx || audCtx.state === 'suspended') {
        audCtx = new AudioContext();
    } else {
        audCtx.resume().then(() => {
            console.log("AudioContext resumed successfully");
        });
    }
}

$('.music-play').on('click', function() {
    let music = $('form input[type="radio"][name="music"]:checked').val();
    if (music == '1') {
        play_music(audio_1);
    } else if (music == '2') {
        play_music(audio_2);
    } else if (audio_s) {
        play_music(audio_s);
    } else {
        console.log("error");
        return;
    }
});

//$('.range').on('change',function(){$('.range-value span').text($(this).val())});
//$('.range2').on('change',function(){$('.range-value2 span').text($(this).val())});

var is_vib_now = false;
function vib_control(need_vib) {
    if (need_vib == is_vib_now){
        return;
    } else if (need_vib) {
        navigator.vibrate(114514);
        is_vib_now = true;
    } else {
        navigator.vibrate(0);
        is_vib_now = false;
    };
};

function play_music(audio) {
    createOrResumeAudioContext();

    const analyser = audCtx.createAnalyser();
    const source = audCtx.createMediaElementSource(audio);

    // 连接音频源到AnalyserNode
    source.connect(analyser);
    analyser.connect(audCtx.destination);

    // 设置参数
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let lastLoudness = 0;
    let lastFreq = 0;
    let thresholdLoudnessDelta = 0.09;
    let thresholdFreqDelta = 25500;

    audio.addEventListener('ended', () => {
        vib_control(false);
    });

    function processAudioData() {
        requestAnimationFrame(processAudioData);

        // 获取当前音频数据
        analyser.getByteTimeDomainData(dataArray);

        // 计算响度
        const loudness = Math.max(...dataArray) / 255;

        // 计算音调
        let pitch = 0;
        let maxIndex = -1;
        for (let i = 0; i < bufferLength; i++) {
            if (dataArray[i] > pitch) {
                pitch = dataArray[i];
                maxIndex = i;
            }
        }
        const freq = (maxIndex * audCtx.sampleRate) / bufferLength;

        // 判断是否需要震动
        const loudnessDelta = Math.abs(loudness - lastLoudness);
        const freqDelta = Math.abs(freq - lastFreq);

        let needVib = false;
        if (loudnessDelta > thresholdLoudnessDelta) {
            needVib = loudness > lastLoudness;
        } else if (freqDelta > thresholdFreqDelta) {
            needVib = freq > lastFreq;
        }

        vib_control(needVib);

        lastLoudness = loudness;
        lastFreq = freq;

        console.log("Loudness Delta:", loudnessDelta, "Frequency Delta:", freqDelta);
    }

    processAudioData();

    audio.play();
};