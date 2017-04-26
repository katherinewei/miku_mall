require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common/goods', 
    'h5/js/common/weixin'
], function($, URL, Data, Goods, Weixin) {

    var Page;

    function init() {
        fetch().done(render);
    }

    function fetch() {
        var pomi = $.Deferred();
        Data.fetchGiftItem().done(function(res) {
            if (res && res.item) {
                var goods = Goods.create(res.item);
                goods ? pomi.resolve(goods) : pomi.reject(0, {
                    msg: '不是一个合法的商品数据'
                });
            } else {
                pomi.reject(0, {
                    msg: '未找到商品数据'
                });
            }
        }).fail(function(code, json) {
            pomi.reject(json);
        });
        return pomi.promise();
    }

    function render(goods) {
        var template = '<section id="active-2015-03-18" style="background-color: #fdee86;"><div class="active-layout" style="padding-bottom: 20px;"><img class="active-img" src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150423/vNTT-0-1429773686881.jpg!q75" style="margin: 0 auto;"><div style="width: 320px;margin: 0 auto;"><div class="button obtain" style="width: 240px;font-size: 22px;padding: 5px 0;/* margin-left: -120px; */margin: 0 auto;">立即领取</div><div class="" style="display: none;"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150406/vNTT-0-1428304363190.png" style="width: 187px;margin: 0 auto;"></div></div><div class="guide" style="width: 320px;padding:20px 40px 0 ;margin: 0 auto;"><h1 style="font-size: 15px;color: #a4761c;margin-bottom: 5px;">活动规则</h1><p>1.新人专享，每个新用户限领取一份<br>2.只支持活动现场领取或站点自提<br>3.本活动不支持使用积分与货到付款</p><h1 style="font-size: 15px;color: #a4761c;margin-bottom: 5px;margin-top: 20px;">再送35元水果红包</h1><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150406/vNTT-0-1428303941378.jpg"></div><div class="button range" style="margin: 40px auto 0;width: 240px;background: transparent;border: 1px solid #e3103f;color: #e3103f;">查看活动范围</div><div style="text-align: center;margin: 10px;color: #606060;">本次活动解释权归果格格所有</div><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150416/vNTT-0-1429199077296.png" style="width: 174px;margin: 50px auto 0px;"></div></section>';
        
        Page = $(template).appendTo('body');

        bindEvent(goods);

        Weixin.share({
            title: '1元抢果盒再送35元水果红包', // 分享标题
            desc: '买水果，就上果格格',
        });

    }

    function bindEvent(goods) {
        Page.on('tap', '.obtain', function(event) {
            event.preventDefault();
            goods.check(1, 0).done(function(res) {
                console.log(res);
                URL.assign('/api/h/1.0/placeOrder.htm?gid=' + goods.itemId + '&count=1');
            }).fail(function(json) {
                if(json.limit){
                    alert((json && json.msg) + '\n去看看其他水果吧！');
                    URL.assign('/api/h/1.0/listPage.htm');
                }else{
                    alert(json && json.msg || '未知错误');
                }
            });
        }).on('tap', '.range', function(event) {
            event.preventDefault();
            
            require('h5/js/common/mapDialog', function(MapDialog) {
                var mapDialog = new MapDialog().show().set('shopId', pageConfig.shopid);
            });
        });
    }

    init();
});
