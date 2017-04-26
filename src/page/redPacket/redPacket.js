/**
 * 全场通用红包
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/weixin'
], function ($, URL, Data, Common, WeiXin) {
    //初始化

    var receiveUrl,
        pUserId = URL.param.pUserId ? URL.param.pUserId : 0,
        receiveUrlWX;

    function init() {
        var Page = render();
        bindEvents(Page);
        $('.waitting').hide();
        weiXinShare();

        if(pageConfig.pid){
            Data.fetchMineInfo().done(function(res){
                URL.assign(URL.receiveRedPacketHtm + '?mobile=' + res.mobile + '&parentId=' + pUserId)
            })
        }


    }

    //生成页面
    function render() {
        //header template
        var template = '<div class="page-content"></div>';
        Page = $(template).appendTo('body');
        //红包
        var redEnevlop = '<div class="redEnelopWrap redEnelopWrapHeight" id="enevlop"><div class="redEnelop"><div class="redTop"><img src="' + URL.imgPath + '/common/images/envelop.jpg" /> <div class="pic_money pic_money1"><span>￥</span></div><div class="pic_money pic_money2"><span>￥</span></div><div class="pic_money pic_money3"><span>￥</span></div></div><div class="redMiddle"><p>领取<b class="price">199</b>现金券，<br />到米酷任性买买买！</p> <form><input type="tel" value="" placeholder="请输入手机号码领取红包" class="mobile" name="mobile"><input type="hidden" name="parentId" /> <input type="submit" value="领取" class="submit" /></form></div></div></div>'
        Page = $(redEnevlop).appendTo('.page-content');
        //rule
        var rule = '<div class="rule rule2"><div class="rulebg"></div><div class="ruleCont"><h3><span class="line"></span><b>红包规则</b></h3><ul><li>输入手机号成功领取全场通用红包，红包激活后方可使用。</li><li>红包激活：新用户领取后可关注米酷公众号或下载注册米酷APP，登录激活红包。</li><li>APP消费时抵扣现金使用，逾期未使用则作废，使用红包手机号需要为领取红包的手机号。</li><li>用红包支付后若订单发生退款，红包不退回用户账户。</li><li>法律允许的范围内，米酷拥有最终解释权。</li></ul></div></div>';
        Page = $(rule).appendTo('.page-content');
        return $('#enevlop');

    }

    //
    function bindEvents(page) {
        page.on('tap', '.submit', function (event) {
            event.preventDefault();

            var mobile = $('.mobile', page),
                data = {
                    mobile: $.trim(mobile.val())
                },
                parentId = pageConfig.parentId,
                telReg = data.mobile.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
            if (!data.mobile) {
                bainx.broadcast(mobile.attr('placeholder'));
                return;

            } else if (!telReg) {
                bainx.broadcast('请输入正确的手机号码！');
                return;
            }

            if (Common.inWeixin) {
                receiveUrlWX = URL.site + URL.receiveRedPacketHtm + '?mobile=' + data.mobile + '&parentId=' + pUserId;
                location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx21647f957347c195&redirect_uri=' + encodeURIComponent(receiveUrlWX) + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
            } else {
                location.href = URL.receiveRedPacketHtm + '?mobile=' + data.mobile + '&parentId=' + pUserId;
            }


        });


    }



    //分享
    function weiXinShare() {
        if (Common.inWeixin) {
            // console.log(document.title);
            // var inQuestion = location.href.match(/\?/i);

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
