/**
 * Created by Spades-k on 2015/12/17.
 */
require([
    'jquery',
    'h5/js/common/url'
], function($, URL) {

    var Page;

    function init() {
        render();
    }

    function render() {
        var template = '<section><div class="content"><img src="'+imgPath+'active/images/shareIntro.jpg" alt=""><a class="btn-invita"></a><a class="btn-invita-large"></a></div></section>';

        Page = $(template).appendTo('body');

        $('.waitting').hide();

        bindEvent();
    }

    function bindEvent() {
        Page.on('tap', '.btn-invita, .btn-invita-large', function(event) {
            event.preventDefault();
            location.href = URL.myInviteAlly;
        });
    }

    init();
});