// 初始化音频元素
var audio_1 = new Audio();
audio_1.src = 'bestmusic.mp3';
audio_1.load();

var audio_2 = new Audio();
audio_2.src = 'Lockyn-Volt.mp3';
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
        console.log("请选择或上传音乐文件");
        return;
    }
});

$('.range').on('change',function(){$('.range-value span').text($(this).val())});
$('.range2').on('change',function(){$('.range-value2 span').text($(this).val())});

function play_music(audio) {
    createOrResumeAudioContext();

    // 检查音频是否已加载
    if (audio.readyState >= 3) { // HAVE_FUTURE_DATA 或 HAVE_ENOUGH_DATA
        if (!audio.isPlaying) {
            audio.isPlaying = true;
            console.log(`Playing audio: ${audio.src}`);

            // 创建MediaElementSourceNode
            var source = audCtx.createMediaElementSource(audio);
            
            // 创建AnalyserNode
            var analyser = audCtx.createAnalyser();
            analyser.fftSize = 512;
            var dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            // 连接音频源和分析器
            source.connect(analyser);
            analyser.connect(audCtx.destination);

            // 开始播放音频
            audio.play().then(() => {
                console.log("Audio started playing");

                // 更新频率数据并判断是否触发振动
                function updateFrequencyData() {
                    requestAnimationFrame(updateFrequencyData);
                    
                    analyser.getByteFrequencyData(dataArray);
                    
                    // 假设一个简单的阈值判断
                    let totalActivity = dataArray.reduce((sum, value) => sum + value, 0);
                    if (totalActivity > $('.range').val()) { 
                        console.log("Vibration threshold met");
                        console.log("Total activity:", totalActivity);
                        
                        if ('vibrate' in navigator && !audio.vibrating) {
                            navigator.vibrate($('.range2').val());
                            console.log("Vibration triggered");
                            audio.vibrating = true;
                            setTimeout(() => {
                                audio.vibrating = false;
                                console.log("Vibration cooldown finished");
                            }, $('.range2').val());
                        }
                    }
                }

                // 启动更新频率数据
                updateFrequencyData();
            }).catch(error => {
                console.error("Error playing audio:", error);
            });
        }
    } else {
        console.log("Audio not ready yet");
    }
};