// 这页就是自己写的
const div = $('.touch-area');
var mousedown = false;
var lastX = 0;
var lastY = 0;
div.on('touchstart',function(e){
    e.preventDefault();
    navigator.vibrate(50);
    mousedown = true;
});
div.on('touchend',function(e){
    mousedown = false;
});
div.on('touchmove',function(e){
    if(mousedown){
        let x = e.originalEvent.touches[0].pageX;
        let y = e.originalEvent.touches[0].pageY;
        let dx = Math.abs(x - lastX);
        let dy = Math.abs(y - lastY);
        let d = Math.sqrt(dx*dx + dy*dy);
        //navigator.vibrate(d * 2);
        if (d > 114.5141919810){d = 110};
        setTimeout(function(){
            navigator.vibrate(d * 1.14514);
        }, d / 2);
        lastX = x;
        lastY = y;
        console.log(d);
    }
});