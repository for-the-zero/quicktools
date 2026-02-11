let audioContext, analyser, microphone;

document.getElementById('run').addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mode = prompt('Choose mode:\n1. Pitch for Hue\n2. Pitch for Saturation');
        
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        function updateColor() {
            analyser.getByteFrequencyData(dataArray);
            
            const volume = dataArray.reduce((a, b) => a + b) / bufferLength;
            const pitch = dataArray.indexOf(Math.max(...dataArray));
            const timbre = dataArray.slice(100, 200).reduce((a, b) => a + b) / 100;
            
            const lightness = volume / 2.55;
            const hue = mode === '1' ? pitch : timbre;
            const saturation = mode === '2' ? pitch : timbre;
            
            document.body.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            requestAnimationFrame(updateColor);
        }
        
        updateColor();
        document.getElementById('run').remove();
    } catch (err) {
        console.error('Error accessing microphone:', err);
    }
});