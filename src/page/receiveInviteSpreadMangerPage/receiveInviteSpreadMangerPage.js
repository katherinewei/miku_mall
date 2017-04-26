/**
 * 全场通用红包接收
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/weixin'
], function ($, URL, Data, Common, WeiXin) {
    //初始化
    var Page;
    console.log(pageConfig);

    function init() {

        render();
        weiXinShare();

        $('.waitting').hide();

    }
    //生成页面
    function render() {

        //红包接收页面
        var redEnevlopRe = '<section class="inviteSP page-content"><div class="banner"><p class="text"></p><a class="btn"></a> </div> <div class="makeMoneyWrap"> <article><div class="boxContent"><h4><span>米酷推广经理特权</span></h4><div class="list"> <div class="grid"> <dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power1.png"/></div></dt><dd class="col col-18"><h3>轻松享受一键式营销</h3> <p>吸睛营销方案公司提供，只需动动手指， 就能坐等推广费进兜。</p> </dd> </dl> </div><div class="grid"> <dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power2.png"/> </div></dt><dd class="col col-18"><h3>推荐拿奖励</h3> <p>每成功推荐一人成为推广经理，即可获得推荐奖励</p> </dd> </dl> </div><div class="grid"><dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power3.png"/></div></dt> <dd class="col col-18"><h3>销售拿推广费</h3><p>一切售后物流无需担忧，推广+促成交易， 推广费到手妥妥的。</p> </dd></dl></div> <div class="grid"><dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power4.png"/></div></dt><dd class="col col-18"><h3>自购拿返利</h3><p>自己想买？高额返利同样拿到手软！</p></dd></dl></div></div></div> </article></div></section>';
        Page = $(redEnevlopRe).appendTo('body');

        bindEnevt();
        receiveEneplop();

    }
    //
    function bindEnevt() {
        $('.shareBtn').on('tap', function (event) {
            shareTips();
        })
    }

    //领取红包
    function receiveEneplop() {
        var text = '.text',
            status = pageConfig.status;

        switch (status) {
            case '1':           //已注册
                $(text).text("感谢您关注米酷,您已经是米酷推广经理了,赶紧进行推广吧!");  //是代理时

                //不是代理时
                $(text).text("感谢您关注米酷,赶紧购买创业礼包,成为推广经理,开启赚钱模式吧!");

                $('.banner .text').after('<a class="btn" href="'+URL.buyForJoinAgencyPage+'?type=1">成为推广经理</a>');//只有在微信中才显示

                if (Common.inWeixin) {
                    $('.btn').text("进入米酷").attr("href", URL.index);
                } else {
                    $('.btn').text("下载米酷APP").attr("href", Common.downloadLink);
                }
                break;
            case '2':               //未注册已关注
                $(text).text("快去米酷看看");
                $('.btn').text("进入米酷").attr("href", URL.index);
                break;
            case '3':               //未注册未关注
                $(text).text("请关注米酷公众号");
                $('.btn').text("关注").attr("href", 'http://mp.weixin.qq.com/s?__biz=MzA5NjQ4MDQ3Nw==&mid=400607662&idx=1&sn=104bb3cf79486a71e6484fc2f54872e2&scene=0#wechat_redirect');
                break;
            case '4':               //不是微信端未注册
                $(text).text("恭喜你成功注册米酷,赶紧购买创业礼包,成为推广经理,开启赚钱模式吧!");
                $('.btn').text("下载米酷APP").attr("href", Common.downloadLink);
                break;
            default:
                bainx.broadcast(pageConfig.msg);
                break;
        }

    }

    //分享
    function weiXinShare() {
        if (Common.inWeixin) {
            console.log(document.title);
            var inQuestion = location.href.match(/\?/i);

            var shareUrl = URL.site + URL.redPacketHtm + '?pid=' + pageConfig.pid+'&isShare=1',
                shareImgUrl = URL.imgPath + 'common/images/invite-redpag.png',
                desc = '米酷发福利啦，亲们快快进来领红包吧！',
                shareOption = {
                    title: '米酷', // 分享标题
                    desc: desc, // 分享描述
                    link: shareUrl, // 分享链接
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
