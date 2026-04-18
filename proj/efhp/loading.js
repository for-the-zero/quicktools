window.onload = () => {
    const minDisplayTime = 1300;
    const startTime = Date.now();
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
    setTimeout(() => {
        document.querySelector('.loading-page').classList.add('loading-finished');
        setTimeout(() => {
            document.querySelector('.loading-page').remove();
        }, 1000);
    }, remainingTime);
};