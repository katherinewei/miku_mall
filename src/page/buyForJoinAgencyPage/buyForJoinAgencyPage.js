/**
 * 99礼包
 * Created by xiuxiu on 2016/3/2.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/transDialog',
    'h5/js/common/nexter',
    'h5/js/common/weixin',
], function ($, URL, Data, Common, Dialog, Nexter,WeiXin) {
    var Page;

    function init() {

        render();
        weiXinShare();


    }

    function render() {

        if(!URL.param.pUserId){
            URL.assign(URL.beJoinAgencyGift);
        }else{
            //header
            Common.headerHtml('购买礼包');

            var buyGift = '<div class="page-content buyGift"><div class="banner"><img id="img" src="' + URL.imgPath + '/common/images/bg_top.png"></div><ul class="grid"></ul><div class="activityRule"><div class="title"><img src="' + URL.imgPath + '/common/images/activityRule.png"/></div> <p>1、购买任意礼包，即可成为推广经理。<br/>2、购买的礼包无产品质量问题，均不予退还。<br/>3、加盟成功后，如有号码信息变更，请联系平台客服。</p> </div></div>';
            Page = $(buyGift).appendTo('body');

            document.getElementById('img').onload=function(){
                getGoodsList();
                Page.on('tap','[href]',function(event){
                    event.preventDefault();
                    Common.addPUserId($(this));
                });
            }
        }
    }
    //查询礼包
    function getGoodsList(){
        var element = $('.buyGift');
        var nexter = new Nexter({
            element: element,
            dataSource: Data.fetchItems,
            enableScrollLoad: true,
            data: {
                itemTypes: 9,
            },
        }).load().on('load:success', function (res) {
            console.log(res);
            var html=[];

            if (res.items.length) {
                $.each(res.items, function (index, item) {
                    html.push(htmlItems(item));
                });
                $('.buyGift .grid').append(html.join(''));
            } else if (this.get('pageIndex') == 0) {
                $('.buyGift .grid').html('<div class="not-has-msg"><img src="'+URL.imgPath+'/common/images/loading_fail.png"/><p>灰常抱歉，暂时没有数据哦</p></div>');
            }
        });
    }
    function htmlItems(item) {
        var tpl = '<li class="row" href="'+URL.goodsDetail+'?gid={{itemId}}"><div class="thumb">{{pics}}</div><div class="col"><p>{{title}}</p><p>礼包价：<span class="price">{{price}}</span> </p><p><del>市场价：<span class="price">{{refPrice}}</span></del></p></div></li>',
            thumbsHtml = [];
        item.price = Common.moneyString(item.price);
        item.refPrice = Common.moneyString(item.refPrice);
        if(item.pics){
            item.pics = item.pics.split(';');
            $.each(item.pics,function(index,item) {
                thumbsHtml.push('<img src="'+item+'" alt="" >');
            });
            item.pics = thumbsHtml.join('');
        }
        return bainx.tpl(tpl, item);
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
})
