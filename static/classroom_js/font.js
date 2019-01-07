// JSON' in window
// true
// "meSSSA" in window
// false
// 判断当前方法是不是属于window  是true 不是false 注意要用字符串
(function(doc, win) {
    var docEl = doc.documentElement; //回头ml
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

    // 事件部分
    var recalc = function() {
        var clientWidth = docEl.clientWidth; //视口宽度
        if (!clientWidth) return;
        docEl.style.fontSize = 20 / 375 * clientWidth + "px";
    }
    // 触发部分

    if (!doc.addEventListener) return;



    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);


})(document, window);
