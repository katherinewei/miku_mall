/**
 * 领取国足奖金券
 * Created  on 2016/03/30.
 */
require([
    'jquery',
    'h5/js/common',
    'h5/js/common/data',
    'h5/js/common/weixin'
], function ($, Common,Data,Weixin) {

    var Page;

    function init() {
        var template = '<section id="page"><div class="content"><img src="' + imgPath + 'active/images/bonusCertificate.jpg" alt=""><a class="btn getCoupon"></a></div></section>';

        Page = $(template).appendTo('body');
        document.title = '领取国足奖金券';

        $('.waitting').hide();
        weiXinShare();
        bindEvent();
    }
    function bindEvent() {
        $('body').on('tap', '.getCoupon', function (event) {
            event.preventDefault();

            Data.receiveActiveCoupon().done(function(res){
                $('body').append('<section class="telDialog wl-trans-dialog translate-viewport" style="display: block"><div class="cont bounceIn"><p class="tips"></p><div class="btngroup"><span class="btn reset">取消</span> <span class="btn share">分享好友</span></div></div></section>');
                if(res.status == 1){
                    $('.tips').text('领取成功！');
                }else{
                    $('.tips').text('亲~您已领取过优惠券，不能再领取啦~');
                }

            })

        }).on('tap', '.btngroup .btn', function (event) {
            event.preventDefault();
            $('.telDialog').remove();
        }).on('tap', '.share', function (event) {
            event.preventDefault();
            Common.shareTips('#page',500);
        });
    }
    function weiXinShare(){
        if(Common.inWeixin){
            var shareUrl = location.href,
                title = '号外号外~红旗不倒，国足骄傲',
                shareOption = {
                    title:title, // 分享标题
                    desc:title,
                    link: shareUrl, // 分享链接
                    imgUrl: imgPath + 'active/images/bonusCertificate.jpg' // 分享图标
                }

            Weixin.hideMenuItems();
            Weixin.showMenuItems();
            Weixin.share(shareOption);
        }
    }
    init();
});