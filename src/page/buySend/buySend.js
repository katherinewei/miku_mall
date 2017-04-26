/**
 * 买就送
 * Created  on 2016/01/08.
 */
require([
    'jquery',
    'h5/js/common/url'
], function ($, URL) {

    var Page;

    function init() {
        render();
    }

    function render() {
        var template = '<section><div class="content"><img src="' + imgPath + 'active/images/buySend.jpg" alt=""><a class="btn"></a></div></section>';

        Page = $(template).appendTo('body');

        $('.waitting').hide();

        bindEvent();
    }

    function bindEvent() {
        Page.on('tap', '.btn', function (event) {
            event.preventDefault();
            location.href = URL.index;
        });
    }

    init();
});