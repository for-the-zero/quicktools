// 初始化音频元素
var audio_1 = new Audio();
audio_1.src = 'bestmusic.mp3';
audio_1.load();

var audio_2 = new Audio();
audio_2.src = 'Valence-Infinity.mp3';
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
    //
};