/**
 * 邀请成为推广经理
 */


require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/countDown',
    'h5/js/common/weixin',
], function ($, URL, Data, Common, CountDown,WeiXin) {
    var Page;
    $('.waitting').hide();
    weiXinShare();
    function init() {

        render();


    }
    function render() {
        //header
        //var mainPage = '<section class="inviteSP page-content"><div class="banner"><img src="' + URL.imgPath + '/common/images/joinAgencyGift/1.png"> </div> <div class="makeMoneyWrap"><article><div class="boxContent"><h4><span>米酷推广经理特权</span></h4><div class="list"> <div class="grid"> <dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power2.png"/> </div></dt><dd class="col col-18"><h3>平台代理权</h3> <p>享受米酷平台上百万款热销产品的代理权，推广销售即可获得高额奖励</p> </dd> </dl> </div><div class="grid"><dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power3.png"/></div></dt> <dd class="col col-18"><h3>推广拿高额奖励</h3><p>每成功推荐一位好友成为推广经理，或推广销售平台上的任何产品，都可获得高额奖励</p> </dd></dl></div> <div class="grid"><dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power4.png"/></div></dt><dd class="col col-18"><h3>自购拿返利</h3><p>自己购买平台上的任何产品，都可获得高额返利。</p></dd></dl></div><div class="grid"> <dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power1.png"/></div></dt><dd class="col col-18"><h3>轻松享受一键式营销</h3> <p>吸睛营销方案公司提供，只需动动手指， 就能坐等推广费进兜。</p> </dd> </dl> </div></div></div></article><div class="rule"><!--<h4><span>如何购买</span></h4>--><div class="imgbox"><img src="'+URL.imgPath+'/common/images/joinAgencyGift/2.png"/><img src="'+URL.imgPath+'/common/images/joinAgencyGift/3.png"/><img src="'+URL.imgPath+'/common/images/joinAgencyGift/4.png"/><img src="'+URL.imgPath+'/common/images/joinAgencyGift/5.png"/><img src="'+URL.imgPath+'/common/images/joinAgencyGift/6.png"/><img src="'+URL.imgPath+'/common/images/joinAgencyGift/7.png"/><img src="'+URL.imgPath+'/common/images/joinAgencyGift/8.png"/><img src="'+URL.imgPath+'/common/images/joinAgencyGift/9.png"/><img src="'+URL.imgPath+'/common/images/joinAgencyGift/10.png"/></div> <p>平台创业礼包需要通过邀请才能购买，如果没获得邀请二维码或邀请链接，请咨询<span href="tel:'+Common.companyTel+'" class="common_tel">'+Common.companyTel+'</span>或搜索微信公众号"米酷SDP"或扫码进入<img class="wxCode" src="'+imgPath+'common/images/publicNo.png"/></p> </div> </div></section>';
        var mainPage = '<section class="inviteSP"><img src="'+imgPath+'/common/images/joinAgencyGift/beJoin1.jpg"/><img src="'+imgPath+'/common/images/joinAgencyGift/beJoin2.jpg"/><img src="'+imgPath+'/common/images/joinAgencyGift/beJoin3.jpg"/><img src="'+imgPath+'/common/images/joinAgencyGift/beJoin4.jpg"/><img src="'+imgPath+'/common/images/joinAgencyGift/beJoin5.jpg"/><img src="'+imgPath+'/common/images/joinAgencyGift/beJoin6.jpg"/><img src="'+imgPath+'/common/images/joinAgencyGift/beJoin7.jpg"/><img src="'+imgPath+'/common/images/joinAgencyGift/beJoin8.jpg"/><img src="'+imgPath+'/common/images/joinAgencyGift/beJoin9.jpg"/><img src="'+imgPath+'/common/images/joinAgencyGift/beJoin10.jpg"/><img src="'+imgPath+'/common/images/joinAgencyGift/beJoin11.jpg"/><img src="'+imgPath+'/common/images/joinAgencyGift/beJoin12.jpg"/> </section>';
        Page = $(mainPage).appendTo('body');

        //document.title = '如何成为推广经理';

    }
    function weiXinShare() {
        if (Common.inWeixin) {

            var shareUrl = URL.site + URL.inviteSpreadMangerPage + '?pUserId=' + pageConfig.pid+'&isShare=1',
                shareImgUrl = URL.imgPath + 'common/images/straInvite_share.png',
                desc = '上米酷，人人都是CEO！无忧生活从这一刻开始',
                shareOption = {
                    title: '米酷', // 分享标题
                    desc: desc,// 分享描述
                    link: shareUrl,
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    imgUrl: shareImgUrl, // 分享图标
                },
                shareOptionTimeline = {
                    title: desc, // 分享标题
                    link: shareUrl, // 分享链接
                    imgUrl: shareImgUrl // 分享图标
                };

            WeiXin.hideMenuItems();
            WeiXin.showMenuItems();
            WeiXin.share(shareOption, shareOptionTimeline);
        }

    }
    init();

});
