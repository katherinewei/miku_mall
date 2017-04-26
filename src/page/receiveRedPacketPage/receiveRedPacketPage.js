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
        //header
        var template = '<div class="page-content"></div>';
        Page = $(template).appendTo('body');
        //红包接收页面
        var redEnevlopRe = '<div class="redEnelopWrap"><div class="redEnelopRe"><div class="redEnveCont"><p></p> <span class="tips"></span> <a href="" class="makeOK"></a></div><div class="envelopImg"><img src="' + URL.imgPath + '/common/images/envelope.png" /></div></div></div>';
        Page = $(redEnevlopRe).appendTo('.page-content');
        //rule
        var rule = '<div class="rule"><div class="rulebg"></div><div class="ruleCont"><h3><span class="line"></span><b>红包规则</b></h3><ul><li>输入手机号成功领取全场通用红包，红包激活后方可使用。</li><li>红包激活：新用户领取后可关注米酷公众号或下载注册米酷APP，登录激活红包。</li><li>APP消费时抵扣现金使用，逾期未使用则作废，使用红包手机号需要为领取红包的手机号。</li><li>用红包支付后若订单发生退款，红包不退回用户账户。</li><li>法律允许的范围内，米酷拥有最终解释权。</li></ul></div></div>';
        Page = $(rule).appendTo('.page-content');
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
    function receiveEneplop(page) {
        var text = '.redEnveCont p',
            span = '.redEnveCont span',
            aTxt = '.redEnveCont .makeOK',
            status = pageConfig.status;
        if (Common.inWeixin) {
            var template = ' <a class="shareBtn">分享给朋友</a>';
            $('.makeOK').after(template);
        }
        $('.shareBtn').on('tap', function (event) {
            Common.shareTips('.page-content', 500, 700);
        })
        switch (status) {
            case '1':
                $(text).text("抱歉，你已经领取过红包了。");
                $(span).text("");
                if (Common.inWeixin) {
                    $(aTxt).text("去米酷看看");
                    $(aTxt).attr("href", URL.index);

                } else {
                    var template = '<a href="" class="download">下载APP</a>';
                    $('.makeOK').after(template);
                    $(aTxt).text("打开米酷APP");
                    $(aTxt).attr("href", 'sunflowerseeds://');
                    $('.download').attr("href", Common.downloadLink);
                }
                break;
            case '2':
                $(text).text("199元现金红包已放入您的账户");
                $(span).text("进入“米酷”个人中心-我的红包中查看");
                $(aTxt).text("进入米酷");
                $(aTxt).attr("href", URL.index);
                break;
            case '3':
                $(text).text("199元现金红包已放入您的账户");
                $(span).text("关注“米酷”后激活");
                $(aTxt).text("关注");
                $(aTxt).attr("href", 'http://mp.weixin.qq.com/s?__biz=MzA5NjQ4MDQ3Nw==&mid=400607662&idx=1&sn=104bb3cf79486a71e6484fc2f54872e2&scene=0#wechat_redirect');
                break;
            case '4':
                $(text).text("199元现金红包已放入您的账户");
                $(span).text("下载“米酷”APP后激活");
                $(aTxt).text("下载APP");
                $('.makeOK').attr("href", Common.downloadLink);
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
                shareImgUrl = URL.imgPath + 'common/images/redPack_share.png',
                desc = '米酷分发福利咯，亲们快进来拆红包啦！',
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
