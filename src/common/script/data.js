/**
 * 数据
 */
define('h5/js/common/data', [
    'jquery',
    'request',
    'h5/js/common/url',
    'h5/js/common/storage',
    'h5/js/common/waitting'
], function($, Request, URL, WLStorage, Waitting) {

    var LOADINGTEXT = '';

    var ERROR_PROMISE = $.Deferred();
    ERROR_PROMISE.reject();

    var S = {
        fail: function(msg) {
            return function(code, json, piomset, ajax) {
                if (URL.param.session != 'expire') {
                    if (code == 61 && !/indexPage\.htm$/gi.test(location.pathname)) {
                        URL.assign(URL.index + '?session=expire');
                        return;
                    }
                }
                bainx.broadcast(json && json.msg || msg);
            };
        },

        tagItems: function(data) {
            //data = {
            //  tag : bit值 
            //  pg : 页码
            //  sz : 页大小
            //}
            var pomi = Request(URL.tagItems, data).fail(S.fail('获取商品数据失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        fetchGiftItem: function() {
            var pomi = Request(URL.fetchGiftItem, null, 1, 1).fail(S.fail('获取新人礼品失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /**
         * 设置用户站点
         */
        setShop: function(position) {

            var data = {};
            if (position) {
                if (position.lat && position.lng && !position.cid) {
                    data = {
                        lat: position.lat,
                        lng: position.lng,
                        addr: encodeURIComponent(JSON.stringify(position))
                    };
                } else if (position.cid) {
                    data = {
                        cid: position.cid,
                        op: 'set',
                        addr: encodeURIComponent(JSON.stringify(position))
                    }
                }
            }

            var pomi = Request(URL.lbsCommunity, data).done(function(res){
                if(res){
                    WLStorage.lbsCommunity.set(res);
                }
            });

            Waitting.show('正在前往站点...', pomi);

            return pomi;
        },

        /**
         * 查找站点信息
         * @return {[type]} [description]
         */
        getShop: function(cid) {
            var data = {
//                op: 'fetch'
                //经纬度 lin
                lng:'113.290526',
                lat:'23.232075'
                //end
            };
            if (cid) {
                data.cid = cid;
            }

            var cshops = WLStorage.lbsCommunity.get();
            if(cshops && !$.isEmptyObject(cshops) || ($.isArray(cshops) && cshops.length)){
                var pomi = $.Deferred();
                pomi.resolve(cshops);
            }else{
//                var pomi = $.Deferred();
                var pomi = Request(URL.lbsCommunity, data).done(function(res){
                    if(res){
                        WLStorage.lbsCommunity.set(res);
                    }
                });
                Waitting.show('正在加载...', pomi);
            }
            return pomi;
        },

        doPay: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var url = URL.hPay;
            if (data.pType == 4) {
                url = URL.wxPay;
            }
            var pomi = Request(url, data, 1, 0).fail(S.fail('支付失败！'));
            Waitting.show('正在支付...', pomi);
            return pomi;
        },

        createOrder: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;

            var pomi = Request(URL.createOrder, data, 1, 0).done(function(res) {
                /*if(window.ga){
                 ga('require', 'ecommerce');
                 ga('ecommerce:addTransaction', {
                 'id': res.tradeId,                     // Transaction ID. Required.
                 'affiliation': 'Acme Clothing',   // Affiliation or store name.
                 'revenue': '11.99',               // Grand Total.
                 'shipping': '5',                  // Shipping.
                 'tax': '1.29'                     // Tax.
                 });
                 }*/
            }).fail(S.fail('创建订单失败！'));
            Waitting.show('正在创建订单...', pomi);
            return pomi;
        },
        confirmOrder: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.confirmOrder, data, 1, 1).fail(S.fail('确认订单失败！'));
            Waitting.show('正在确认订单...', pomi);
            return pomi;
        },


        cancelOrder: function(tid) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.cancelOrder, {
                tradeId: tid
            }, 1, 1).fail(S.fail('取消订单失败！'));
            Waitting.show('正在取消订单...', pomi);
            return pomi;
        },
        sureOrder: function (tid) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.sureOrder, {
                tradeId: tid
            }, 1, 1).fail(S.fail('确认收货失败！'));
            Waitting.show('正在确认收货...', pomi);
            return pomi;
        },

        fetchCouponList: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.fetchCouponList, null, 1, 1).fail(S.fail('获取优惠券列表失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        obtainCoupon: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.obtainCoupon, null, 0, 0).fail(S.fail('领取优惠券失败！'));
            Waitting.show('正在抽取...', pomi);
            return pomi;
        },

        fetchCoupon: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.fetchCoupon, null, 1, 1).fail(S.fail('获取优惠券信息失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        obtainPoint: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.obtainPoint, null, 1, 0).fail(S.fail('签到失败！'));
            Waitting.show('正在签到...', pomi);
            return pomi;
        },

        /**
         * 获取积分数据
         * @return {[type]} [description]
         */
        fetchPoint: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.fetchPoint, null, 1, 1).fail(S.fail('获取积分数据失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        /**
         *获取我的钱包数据
         *
         */
        getMyWallet: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getMyWallet, data, 1, 1).fail(S.fail('获取我的钱包数据失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        /**
         * 获取我的盟友
         * @return {[type]} [description]
         */
        myAlly: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.myAlly, null, 1, 1).fail(S.fail('获取我的盟友数据失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        allyApply: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.allyApply, null, 1, 1).fail(S.fail('获取我的盟友申请数据失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        allyList: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.allyList, data, 1, 1).fail(S.fail('获取我的盟友列表数据失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        /**
         * 获取积分明细列表
         */
        fetchPointList: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.fetchPointList, data, 1, 1).fail(S.fail('获取积分明细失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /**
         * 关联商品
         * @param  {ID} id 商品ID
         * @return {ajax}    关联商品
         */
        /*relatedItems: function(id) {
         return Request(URL.relatedItems, {
         itemId: id
         }, 1, 1).fail(S.fail('获取关联商品失败！'));
         },*/

        halfActiveSnapshot: function() {
            var pomi = Request(URL.halfActiveSnapshot, null, 1, 1).fail(S.fail('获取特价商品失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        getBanner: function(k) {
            var data = {
                k: k,
            };
            if ($.isArray(k)) {
                data.k = k.join(',');
            }
            var pomi = Request(URL.getBanner, data).fail(function() {
                console.log(arguments, '获取页面banner数据失败!');
            });
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        wxjssdkParam: function(url) {
            var _url = encodeURIComponent(url);
            //window.confirm(_url);
            var pomi = Request(URL.wxjssdkParam, {
                url: _url
            });
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        fetchTradesSum: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.fetchTradesSum).fail(S.fail('获取订单个数失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },


        searchItems: function (data) {
            var pomi = Request(URL.searchItems, data).fail(S.fail('搜索商品失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        itemSearchSuggest: function (query) {
            var pomi = Request(URL.itemSearchSuggest, {query: query}).fail(S.fail(''));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        fetchItems: function(data) {
            var pomi = Request(URL.getGoodsList, data, 1, 1).fail(S.fail('获取商品列表失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        fetchBrands: function (data) {
            var pomi = Request(URL.fetchBrands, data, 1, 1).fail(S.fail('获取商品列表失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        fetchItemsInfo: function(ids) {
            var pomi = Request(URL.fetchItemsInfo, {
                ids: ids
            }, 1, 1).fail(S.fail('获取商品信息失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        /*getGoodsList: function(cid) {
         return Request(URL.getGoodsList, {
         cateId: cid
         }, 1, 1).fail(S.fail('获取商品列表失败！'));
         },*/
        /**
         * 绑定手机
         * data{ categoryBannermobile: checkNO: }
         */
        /*synCheckMobile: function(data) {
         return Request(URL.synCheckMobile, data).fail(S.fail('绑定手机失败!'));
         },*/

        fetchUserInfo: function() {
            var pomi = Request(URL.getUserInfo, null, 1, 1).fail(S.fail('获取当前用户信息失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        fetchUser: function() {
            var pomi = Request(URL.fetchUser, null, 1, 1).fail(S.fail('获取当前用户信息失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        fetchMineInfo: function() {
            var pomi = Request(URL.fetchMineInfo, null, 1, 1).fail(S.fail('获取当前用户信息失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getOrderDetail: function(id) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getOrderDetail, {
                tradeId: id
            }, 1, 1).fail(S.fail('获取订单详情失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        fetchTrades: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.fetchTrades, data, 1, 1).fail(S.fail('获取订单列表失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        mineTradeCount: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.mineTradeCount).fail(S.fail('获取订单个数失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /*getCommunity: function(cid) {
         return Request(URL.getCommunity, {
         cid: cid
         }, 1, 1).fail(S.fail('获取小区失败！'));
         },*/

        login: function(data) {
            var pomi = Request(URL.login, data, 1, 1).fail(S.fail('登录失败！'));
            Waitting.show('正在登录...', pomi);
            return pomi;
        },
        register: function(data) {
            var pomi = Request(URL.register, data, 1, 1).fail(S.fail('注册失败！'));
            Waitting.show('正在注册...', pomi);
            return pomi;
        },
        checkMobile: function(mobile,yzmNO) {
            var data = {
                act: 'send',
                yzmNO:yzmNO,
                mobile: mobile
            };
            var pomi = Request(URL.checkMobile, data, 1, 1).fail(S.fail('获取验证码失败！'));
            Waitting.show('正在发送...', pomi);
            return pomi;
        },
        /*getGoodsDetail: function(id) {
         return Request(URL.getGoodsDetail, {
         itemId: id
         }, 1, 1).fail(S.fail('获取商品详情失败！'));
         },*/
        /*syncCart: function(data) {
         if (!S.checkProfileId()) return;
         return Request(URL.addCart, data).fail(S.fail('同步购物车数据失败！'));
         },*/
        addCart: function(goodsId, count) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var post = JSON.stringify([{
                item_id: goodsId,
                num: count
            }]);
            var pomi = Request(URL.addCart, {
                items: post
            }, 1, 1).fail(S.fail('添加商品到购物车失败！'));
            Waitting.show('正在' + (count > 0 ? '放入' : '拿出') + '购物车...', pomi);
            return pomi;
        },
        deleteCheckedCart: function(post) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.addCart, {
                items: post
            }, 1, 1).fail(S.fail('删除商品失败！'));
            Waitting.show('正在删除商品', pomi);
            return pomi;
        },
        getCartItems: function() {
            var pomi = Request(URL.getCartItems, null, 1, 1).fail(S.fail('获取购物车详情失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        fetchCates: function() {
            var pomi = Request(URL.fetchCates).fail(S.fail('获取商品类目失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        categoryBanner: function (data) {
            var pomi = Request(URL.categoryBanner, data).fail(S.fail('获取Banner数据失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        fetchCatesByParams: function (data) {
            var pomi = Request(URL.fetchCatesByParams, data).fail(S.fail('获取商品类目失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },


        /**
         * 获取地址列表
         */
        getConsignee: function(id) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var data = {
                    op: 'sel'
                },
                msg = '获取地址列表失败！';
            if (id) {
                data.id = id;
                data.op = 'schs';
                msg = '获取地址信息失败！';
            }
            var pomi = Request(URL.consignee, data, 1, 1).fail(S.fail(msg));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        /**
         * 添加地址
         */
        addConsignee: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            data.op = 'add';
            var pomi = Request(URL.consignee, data, 1, 1).fail(S.fail('添加地址失败！'));
            Waitting.show('正在添加...', pomi);
            return pomi;
        },
        /**
         * 修改地址
         */
        modfiyConsignee: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            data.op = 'u';
            var pomi = Request(URL.consignee, data, 1, 1).fail(S.fail('修改地址失败！'));
            Waitting.show('正在修改...', pomi);
            return pomi;
        },
        /**
         * 删除地址
         */
        delConsignee: function(id) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.consignee, {
                op: 'del',
                id: id
            }, 1, 1).fail(S.fail('删除地址失败！'));
            Waitting.show('正在删除...', pomi);
            return pomi;
        },
        /**
         * 选择地址
         */
        chsConsignee: function(id) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.consignee, {
                op: 'chs',
                id: id
            }, 1, 1).fail(S.fail('选择地址失败！'));
            Waitting.show('正在设置...', pomi);
            return pomi;
        },

        /**
         * 获取默认地址，只在首页确定站点用
         * @return {[type]} [description]
         */
        fetchDefAddr: function() {
            var pomi = Request(URL.fetchDefAddr);
            Waitting.show('正在加载...', pomi);
            return pomi;
        },

        checkActiveOrder: function(ids, daily) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.checkActiveOrder, {
                ids: ids,
                daily: daily
            }, 1, 1).fail(S.fail('抢购失败，请稍候再试！'));
            Waitting.show('正在抢购...', pomi);
            return pomi;
        },

        lbsTrans: function(lat, lng) {
            var pomi = $.Deferred();
            var data = {
                lg: lng,
                lt: lat
            };
            Request(URL.lbsTrans, data).done(function(res) {
                pomi.resolve({
                    lat: res.lt,
                    lng: res.lg,
                    type: 'lbs',
                    trans: 1
                });
            }).fail(function() {
                pomi.resolve({
                    lat: lat,
                    lng: lng,
                    type: 'gps',
                    trans: 1
                });
            });
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        //获取分润首页数据
        profileProfit: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.profileProfit, null, 1, 1).fail(S.fail('获取分润数据失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        //获取分润明细
        salesRecordList: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.salesRecordList, data, 1, 1).fail(S.fail('获取分润明细数据失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        //获取提现明细
        getPayList: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getPayList,data, 1, 1).fail(S.fail('获取提现明细数据失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        //获取申请提现
        reqGetPay: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.reqGetPay, data, 1, 1).fail(S.fail('提交申请失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //获取申请提现
        getReturnSaleRecordVOList: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getReturnSaleRecordVOList, data, 1, 1).fail(S.fail('获取退款分润记录失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        hasProfileId: function() {
            return pageConfig && pageConfig.pid;
        },
        checkProfileId: function() {
            return S.hasProfileId() ? true : (URL.assign(URL.loginPage + '?refurl=' + encodeURIComponent(location.href)), false);
        },

        //获取用户是否注册
        checkIsRegister:function(mobile) {
            var data = {
                mobile: mobile
            };
            var pomi = Request(URL.checkIsRegister, data, 1, 1).fail(S.fail('获取用户是否注册失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        //获取用户是否关注订阅号
        checkAttention: function (openId) {
            var data = {
                openId: openId
            }
            var pomi = Request(URL.checkAttention, data, 1, 1).fail(S.fail('获取用户是否关注订阅号失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //获取红包
        receiveRedPacket: function (mobile, openid, parentId) {
            var data = {
                mobile: mobile,
                openid: openid,
                parentId: parentId
            }
            var pomi = Request(URL.receiveRedPacket, data, 1, 1).fail(S.fail('获取用户是否关注订阅号失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //领取红包
        receiveActiveCoupon: function () {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.receiveActiveCoupon, null, 1, 1).fail(S.fail('领取券失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        checkHasRegisterWeiXin: function () {
            var pomi = Request(URL.checkHasRegisterWeiXin, null, 1, 1).fail(S.fail('获取用户是否在微信公众号注册失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        //我要赚钱
        joinAgency: function () {
            var pomi = Request(URL.joinAgency, null, 1, 1).fail(S.fail('申请成为代理失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        tradeSumFeeByBuyer: function () {
            var pomi = Request(URL.tradeSumFeeByBuyer, null, 1, 1).fail(S.fail('获取消费总额失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //获取系统时间
        getSystemTimes: function () {
            var pomi = Request(URL.getSystemTimes, null, 1, 1).fail(S.fail('获取系统时间失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },


        /**
         * 幸运抽奖--活动
         */


        //幸运抽奖次数
        lotteryDrawTimes: function () {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.lotteryDrawTimes, null, 1, 1).fail(S.fail('获取幸运抽奖次数失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //幸运抽奖
        lotteryDrawMikAtctive: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.lotteryDrawMikAtctive, data, 1, 1).fail(S.fail('幸运抽奖失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        //幸运抽奖
        lotteryDraw: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.lotteryDraw, data, 1, 1).fail(S.fail('幸运抽奖失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //抽奖确认订单
        confirmLotteryDraw: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.confirmLotteryDraw, data, 1, 1).fail(S.fail('获取抽奖确认订单失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //抽奖下订单
        lotteryDrawOrder: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.lotteryDrawOrder, data, 1, 1).fail(S.fail('获取抽奖下订单失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //获取领奖列表
        itemLotteryDrawList: function () {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.itemLotteryDrawList, null, 1, 1).fail(S.fail('获取领奖列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //进入红包摇摇
        doredPacket: function () {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.doredPacket, null, 1, 1).fail(S.fail('获取红包页面失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //摇摇动作进行连接对应的接口
        doredPacketResult: function () {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.doredPacketResult, null, 1, 1).fail(S.fail('摇一摇失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //摇摇动作结果返回的接口
        doredPacketGetPay: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.doredPacketGetPay, data, 1, 1).fail(S.fail('领奖失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /**
         * 颜值测试--活动
         */

        faceScore: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.faceScore, data, 1, 1).fail(S.fail('获取颜值测试结果失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        faceScoreExchange: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.faceScoreExchange, data, 1, 1).fail(S.fail('获取颜值兑换结果失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        faceScoreExchangeList: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.faceScoreExchangeList, data, 1, 1).fail(S.fail('获取颜值兑换列表请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /**
         * 评论
         */
        addComments: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.addComments, data, 1, 1).fail(S.fail('添加评论请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        addCommentsReply: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.addCommentsReply, data, 1, 1).fail(S.fail('回复评论请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        commentsList: function (data) {
            var pomi = Request(URL.commentsList, data, 1, 1).fail(S.fail('评论列表请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        commentsReplyList: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.commentsReplyList, data, 1, 1).fail(S.fail('获取回复评论列表请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getCommentsCount: function (data) {
            var pomi = Request(URL.getCommentsCount, data, 1, 1).fail(S.fail('获取评论统计请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        addCommentsPic: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.addCommentsPic, data, 1, 1).fail(S.fail('上传评论图片请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        uploadCommentPic: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.uploadCommentPic, data, 1, 1).fail(S.fail('上传评论图片请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        uploadCommentPics: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.uploadCommentPics, data, 1, 1).fail(S.fail('上传评论图片请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /**
         * 退货
         */


        getReturnGoodsVOList: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getReturnGoodsVOList, data, 1, 1).fail(S.fail('获取退货退款列表请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        confirmReturnGood: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.confirmReturnGood, data, 1, 1).fail(S.fail('确认退货请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        reqReturnGood: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.reqReturnGood, data, 1, 1).fail(S.fail('申请退货请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        reqReturnGoodAbnormal: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.reqReturnGoodAbnormal, data, 1, 1).fail(S.fail('异常申请退货请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        expressReturnGood: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.expressReturnGood, data, 1, 1).fail(S.fail('退货发快递请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /**
         *众筹
         */
        getCrowdfundList: function (data) {
            var pomi = Request(URL.getCrowdfundList, data, 1, 1).fail(S.fail('获取乐享团商品列表请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getCrowdfundInfo: function (data) {
            var pomi = Request(URL.getCrowdfundInfo, data, 1, 1).fail(S.fail('获取乐享团商品详情请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getCrowdfundItemList: function (data) {
            var pomi = Request(URL.getCrowdfundItemList, data, 1, 1).fail(S.fail('获取乐享团商品列表请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getCrowdfundTradeList: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getCrowdfundTradeList, data, 1, 1).fail(S.fail('获取我的乐享团项目请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        crowdfundBanner: function (k,moduleType) {
            var data = {
                k: k,
                moduleType:moduleType
            };
            if ($.isArray(k)) {
                data.k = k.join(',');
            }
            var pomi = Request(URL.crowdfundBanner, data).fail(S.fail('获取我的乐享团项目请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        myParentUser: function (data) {
            var pomi = Request(URL.myParentUser, data, 1, 1).fail(S.fail());
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        searchLogisticsCallBack: function (data) {
            var pomi = Request(URL.searchLogisticsCallBack, data, 1, 1).fail(S.fail('获取物流信息请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        scratchCard: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.scratchCard, data, 1, 1).fail(S.fail());
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getMyScratchCardList: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getMyScratchCardList, data, 1, 1).fail(S.fail());
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        receiveScanCodeCash: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.receiveScanCodeCash, data, 1, 1).fail(S.fail('领取奖品失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getMyScanCodeCashList: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getMyScanCodeCashList, data, 1, 1).fail(S.fail('获取我的扫码领奖列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        upyunDeleteFile: function (data) {
            var pomi = Request(URL.upyunDeleteFile, data,1,1).fail(S.fail('删除图片请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        upYunUploadPicByUrl: function (data) {
            var pomi = Request(URL.upYunUploadPicByUrl, data,1,1).fail(S.fail('上传图片请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        loginFromPwd: function (data) {
            var pomi = Request(URL.loginFromPwd, data,1,1).fail(S.fail('登录失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        logOut: function () {
            var pomi = Request(URL.logOut, null,1,1).fail(S.fail('退出登录失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },


    };
    return S;
});