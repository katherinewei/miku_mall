/**
 * URL 接口
 */
define('h5/js/common/url', function(){

    var SITE = location.protocol + '//' +location.host + (location.port? (':'+location.port) : '');
    console.log(SITE);
    var ROOT = '/api/h/1.0/';
    var HTML = 'http://h.unesmall.com/h5/html/';  //存放静态页面目录
    var imgPath = 'http://unesmall.b0.upaiyun.com/'; //图片存放路径
    var inWeLink = navigator.userAgent.match(/welink/i);
    /*if(inWeLink){
     alert(inWeLink[0]);
     }else{
     alert(navigator.userAgent);
     }*/

    function locationAssign(_url, replace){
        //alert(_url);
//        console.log(inWeLink);

        if(inWeLink){
            var url = new bainx.Uri(_url);
            var cart = /cartPage\.htm$/i,
                login = /vLoginPage\.htm$/i,
                detail = /detailPage\.htm$/i,
                placeOrder = /placeOrder\.htm$/i,
                userCenter = /userCenter\.htm$/i,
                listPage = /listPage\.htm$/i,
                myCoupon = /myCoupon\.htm$/i,
                profitIndex = /profitIndex\.htm$/i,
                questionnaireSurveyResultPage=/questionnaireSurveyResultPage\.htm$/i;

            if(cart.test(url.path)){
                console.log('APP 实现并跳转到购物车页面， app://cart')
                location.href = "app://cart";
            }else if(login.test(url.path)){
                var refurl = url.query.get('refurl');
                console.log('APP 实现并跳转到登录页面， app://login?data='+encodeURIComponent(JSON.stringify({
                        refurl : refurl
                    })));
                location.href = "app://login?data="+ encodeURIComponent(JSON.stringify({
                        refurl : refurl
                    }));
            }else if(detail.test(url.path)){
                var data = encodeURIComponent(JSON.stringify({
                    itemId : url.query.get('gid')
                }));
                console.log('APP 实现并跳转到商品详情页面，app://detail?data='+data);
                location.href = "app://detail?data="+data;
            }else if(questionnaireSurveyResultPage.test(url.path)){
                var data = encodeURIComponent(JSON.stringify({
                    uid : url.query.get('uid')
                }));
                console.log('APP 实现并跳转到专家详情页面，app://questionnaireSurveyResultPage?data='+data);
                location.href = "app://questionnaireSurveyResultPage?data="+data;
            }else if(placeOrder.test(url.path)){
                var itemId = url.query.get('gid'),
                    count = url.query.get('count'),
                    items = [],
                    data = '';
                if(itemId && count){
                    data = encodeURIComponent(JSON.stringify({items:[{
                        itemId : itemId,
                        count : count
                    }]}));
                }else if(url.query.get('goods')){
                    var goods = url.query.get('goods')+'',
                        items = [];
                    goods = goods.split(';');
                    if(goods.length){
                        $.each(goods,function(index, item){
                            var tmp = item.split(',');
                            if(tmp.length == 2){
                                items.push({
                                    itemId:tmp[0],
                                    count:tmp[1]
                                });
                            }
                        });
                        if(items.length){
                            var data = {
                                items : items
                            };
                            if(url.query.get('from')){
                                data.from = url.query.get('from');
                            }
                            data = encodeURIComponent(JSON.stringify(items));
                        }
                    }
                }

                if(data){
                    console.log('APP 实现并跳转到下单确认页面，app://confirmOrder?data='+data);
                    location.href = 'app://confirmOrder?data='+data;
                }else{
                    console.log('APP 实现并跳转到下单确认页面，app://confirmOrder?data='+encodeURIComponent(JSON.stringify({
                            fromCart : true
                        })));
                    location.href = 'app://confirmOrder?data='+encodeURIComponent(JSON.stringify({
                            fromCart : true
                        }));
                }
            }else if(userCenter.test(url.path)){
                console.log('APP 实现并跳转到个人中心页面，app://personal');
                location.href = "app://personal";
            }else if(profitIndex.test(url.path)){
                console.log('APP 实现并跳转到分润中心页面，app://profitIndex');
                location.href = "app://profitIndex";
            }else if(listPage.test(url.path)){

                var data = {
                    brandId : url.query.get('brandId'),
                    cid : url.query.get('cid')
                };
                data = encodeURIComponent(JSON.stringify(data));
                location.href = "app://listPage?data="+data;
            }else if(myCoupon.test(url.path)){
                var data = {
                    mode: url.query.get('mode')
                };
                data = encodeURIComponent(JSON.stringify(data));
                location.href = "app://myCoupon?data="+data;
            }else{
                if(replace){
                    location.replace(_url);
                }else{
                    location.href = _url;
                }
            }
        }else{
            if(replace){
                location.replace(_url);
            }else{
                location.href = _url;
            }
        }
    }




    var URL = {
        assign : locationAssign,
        site : SITE,
        root : ROOT,
        param: bainx.getQueryParam(),
        imgPath:imgPath,

        index :             ROOT + 'indexPage.htm',
        category :          ROOT + 'catePage.htm', //商品分类
        cateTwoPage:        ROOT + 'cateTwoPage.htm',//二级分类
        goodsDetail:        ROOT + 'detailPage.htm', //商品详情
        list :              ROOT + 'listPage.htm', //商品列表
        cart :              ROOT + 'cartPage.htm',   //购物车
        userCenter :        ROOT + 'userCenter.htm', //会员中心
        searchItems:        ROOT + 'searchItems.json',              //商品搜索
        itemSearchSuggest: ROOT + 'itemSearchSuggest.json',        //搜索提示

        tagItems:           ROOT + 'tagItems.json',                 //根据商品标签查询商品

        fetchGiftItem:      ROOT + 'fetchGiftItem.json',            //亲人礼品

        lbsCommunity:       ROOT + 'lbsCommunity.json',             //定位站点

        alipayDrawboard:    ROOT + 'alipayDrawboard.htm',           //微信支付页面
        wxPay:              ROOT + 'hwxPay.json',
        hPay:               ROOT + 'hPay.json',

        createOrder:        ROOT + 'hOrder.json',                   //创建订单
        placeOrder: ROOT + 'placeOrder.htm',                //确认订单
        cancelOrder:        ROOT + 'cancelOrder.json',              //取消订单
        sureOrder:          ROOT + 'sureOrder.json',                  //确认收货
        orderDetail:        ROOT + 'orderDetail.htm',               //订单详情
        fetchCouponList:    ROOT + 'fetchCouponList.json',          //优惠券列表
        obtainCoupon:       ROOT + 'obtainCoupon.json',             //领优惠券
        fetchCoupon:        ROOT + 'fetchCoupon.json',              //优惠券状态
        obtainPoint:        ROOT + 'obtainPoint.json',              //领积分
        fetchPointList:     ROOT + 'fetchPointList.json',           //获取积分明细
        fetchPoint:         ROOT + 'fetchPoint.json',               //获取积分总数，签到数据
        getMyWallet:        ROOT + 'getMyWallet.json',               //获取我的钱包数据
        myPoint:            ROOT + 'myPoint.htm',                     //签到页面



        loginPage :         ROOT + 'vLoginPage.htm',                //登录页面
        login:              ROOT + 'vCodeLogin.json',               //登录


        /**
         * 订单
         * form="cart" 确认订单
         */
        orderList:          ROOT + 'orderList.htm',                 //我的订单
        confirmOrder:       ROOT + 'confirmOrder.json',             //确认订单
        relatedItems:       ROOT + 'relatedItems.json',             //关联商品
        halfActiveSnapshot: ROOT + 'halfActiveSnapshot.json',       //半价活动
        fetchCommunity :    ROOT + 'fetchCommunity.json',           //自提点
        getBanner:          ROOT + 'homeBanner.json',               //页面banner
        lbsTrans :          ROOT + 'lbsTrans.json',                 //GPS坐标转高德坐标
        wxjssdkParam :      ROOT + 'hjsApiParams.json',             //获取微信JS-SDK,config时所需要的参数
        checkActiveOrder:   ROOT + 'checkActiveOrder.json',          //检查是是否参加过活动
        bindMobile :        ROOT + 'bindMobile.htm',                //绑定手机的页面
        fetchTradesSum:     ROOT + 'fetchTradesSum.json',            //获取订单个数接口
        synCheckMobile:     ROOT + 'synCheckMobile.json',            //绑定手机号码

        getOrderDetail :    ROOT + 'fetchTrade.json',                //获取订单详情
        fetchTrades :       ROOT + 'fetchTrades.json',               //获取订单列表
        mineTradeCount:     ROOT + 'mineTradeCount.json',               //我的订单统计
        getCartItems :      ROOT + 'oCartItems.json',                //获取购物车详情
        getUserInfo :       ROOT + 'fetchUser.json',                 //获取用户信息
        //login :             ROOT + 'login.json',                     //登录
        logout :            ROOT + 'logOut.json',                    //退出
        register :          ROOT + 'register.json',                  //注册
        fetchPub :          ROOT + 'fetchPub.json',                  //获取RSA公钥
        checkMobile :       ROOT + 'checkMobile.json',               //发送验证码
        getMobileVerificationCode:ROOT + 'getMobileVerificationCode.json',//获取验证码图片
        fetchCates :        ROOT + 'fetchCates.json',                  //获取商品类目
        categoryBanner: ROOT + 'categoryBanner.json',        //获取商品分类Banner
        fetchCatesByParams: ROOT + 'fetchCatesByParams.json',        //获取商品一级类目
        getGoodsList :      ROOT + 'listItems.json',                 //获取商品列表
        fetchItemsInfo :    ROOT + 'fetchItemsInfo.json',            //获取商品数据
        fetchBrands :       ROOT + 'fetchBrands.json',              //获取品牌列表
        getGoodsDetail :    ROOT + 'item.json',                      //商品详情?itemId=
        addCart :           ROOT + 'addCart.json',                   //同步购物车
        //getStoresAddress:   ROOT + 'fetchCommunity.json',            //自提点
        /**
         * 收货地址相关操作
         * consignee.json
         * 参数：
         *     op 操作类型
         *         更新传递u
         *         添加传递add
         *         删除传递 del
         *         查询所有操作地址传递 sel
         *         选择该收获地址 chs
         *     id 要更新或者删除的id
         *     mobile 收货地址收件人电话
         *     nick 收货人
         *     addr 收货地址信息 例子 值为：
         *     {
         *           "addcode":   "330110",
         *           "address":   "多少号啊",
         *           "addrgeo":   "xxx",
         *           "city":      "杭州市",
         *           "citycode":  "0571",
         *           "distance":  123,
         *           "district":  "余杭区",
         *           "latitude":  "12.245523",
         *           "longitude": "32.344321",
         *           "name":      "dfad",
         *           "pcode":     "24",
         *           "postcode":  "310000",
         *           "province":  "浙江省",
         *           "tel":       "12",
         *           "type":      "type here",
         *           "uid":       "ioidlfldl81892"
         *       }
         */
        /*
         * 收货地址
         */
        consignee :         ROOT + 'consignee.json',                  //收货地址操作
        fetchDefAddr:       ROOT + 'fetchDefAddr.json',                 //默认地址
        address:            ROOT + 'address.htm',                       //收货地址


        /*
         * 我的分润
         */
        profitHelp:         HTML + 'profit-help.html?type=1',                //帮助页面
        profitIndex:        ROOT + 'profit.htm',                    //首页
        profileProfit:      ROOT + 'profileProfit.json',            //首页数据
        reqGetPayHtm:       ROOT + 'reqGetPay.htm',                //申请提现页面
        reqGetPay:          ROOT + 'reqGetPay.json',                //申请提现数据
        getPayListHtm:      ROOT + 'getPayList.htm',               //提现明细页面
        getPayList:         ROOT + 'getPayList.json',               //提现明细数据
        salesRecordListHtm: ROOT + 'salesRecordList.htm',          //代理分润记录页面
        salesRecordList:    ROOT + 'salesRecordList.json',          //代理分润记录数据

        getReturnSaleRecordVOList: ROOT + 'getReturnSaleRecordVOList.json', //退款分润记录
        returnSaleRecord: ROOT + 'returnSaleRecord.htm', //退款分润记录


        /**
         * 我的盟友
         */
        myAllyHtm:                  ROOT + 'myAlly.htm',                //我的盟友首页
        myAlly:                     ROOT + 'myAlly.json',                //我的盟友首页数据
        allyExamineAttention: HTML + 'allyExamineAttention.html?type=1',  //盟友审核注意事项
        //allyApply :               ROOT + 'allyApply.json',
        allyList: ROOT + 'myInOrDirectAlly.json',       //我的盟友列表数据
        myInOrDirectAlly: ROOT + 'myInOrDirectAlly.htm',       //我的盟友列表页面
        myInviteAlly: ROOT + 'inviteAlly.htm',       //邀请盟友
        myInviteAllyQr: ROOT + 'inviteAllyQrPage.htm',       //二维码邀请
        /*
         * 我的积分
         */
        myPoint:                    ROOT + 'myPoint.htm',       //我的积分
        pointRule: HTML + 'point-guide.html?type=1', //积分规则

        /*
         * 我的红包
         */
        myCoupon:                   ROOT + 'myCoupon.htm',       //我的红包
        receiveActiveCoupon:        ROOT + 'receiveActiveCoupon.json', //领取红包

        redPacketHtm: ROOT + 'redPacket.htm',           //全场通用红包
        checkIsRegister: ROOT + 'checkIsRegister.json',  //是否注册
        checkAttention: ROOT + 'getWxUserByOpenid.json',  //是否关注订阅号
        receiveRedPacketHtm: ROOT + 'receiveRedPacketPage.htm',//领取红包页面
        checkHasRegisterWeiXin: ROOT + 'checkHasRegisterWeiXin.json',  //判断用户是否在微信公众号注册
        howtoAttention: HTML + 'howtoAttention.html?type=1',  //如何关注公众号

        /*
         *我要赚钱
         */
        makeMoneyHtm: ROOT + 'makeMoneyPage.htm',       //我要赚钱
        joinAgency: ROOT + 'joinAgency.json',           //申请成为代理
        tradeSumFeeByBuyer: ROOT + 'tradeSumFeeByBuyer.json',  //消费总额接口

        /**
         *联系我们
         */
        contactUsHtm: ROOT + 'contactUsPage.htm?type=1',       //联系我们

        /**
         * 关于我们
         */
        aboutUsHtm: HTML + 'aboutUs.html',       //关于我们
        /**
         *招商
         */
        businessDepartmentHtm: HTML + 'businessDepartment.html',       //招商

        hActiveHtm: ROOT + 'hActive.htm',       //活动页面
        getSystemTimes:ROOT + 'getSystemTimes.json',   //获取系统时间
        customizationHtm: ROOT + 'customizationPage.htm?type=1',       //私人定制页面
        crowdfundHtm: ROOT + 'crowdfundPage.htm?type=1',       //众筹页面
        faqHtm: HTML + 'faq.html?type=1',//售后问答


        /**
         * 幸运抽奖--活动
         */
        lotteryDrawTimes:  ROOT  + 'lotteryDrawTimes.json',   //抽奖次数接口
        lotteryDraw:  ROOT  + 'lotteryDraw.json',   //抽奖接口
        confirmLotteryDrawHtm:  HTML  + 'confirmLotteryDraw.htm',   //抽奖确认订单接口
        confirmLotteryDraw:  ROOT  + 'confirmLotteryDraw.json',   //抽奖确认订单接口
        lotteryDrawOrder:  ROOT  + 'lotteryDrawOrder.json',   //抽奖下订单接口
        lotteryOrder:  ROOT  + 'lotteryOrder.htm',   //抽奖下订单页面
        itemLotteryDrawList: ROOT + 'itemLotteryDrawList.json',  //领奖接口
        lottery :ROOT  + 'lottery.htm', //抽奖页面

        lotteryDrawMikAtctive:ROOT + 'lotteryDrawMikAtctive.json',

        /**
         * 摇一摇
         */
        doredPacket: ROOT + 'doredpacket.json',   //进入红包摇摇
        doredPacketResult: ROOT + 'doredpacketresult.json',   //摇摇动作进行连接对应的接口
        doredPacketGetPay: ROOT + 'doredpacketgetpay.json',   //摇摇动作结果返回的接口

        /**
         * 个人中心
         */
        fetchUser: ROOT + 'mine.json',  //个人中心接口
        fetchMineInfo:ROOT + 'mineInfo.json',  //个人中心接口,查的信息少一点

        uploadUserQrCode: ROOT + 'uploadUserQrCode.json',   //图片上传接口

        qualityAssuranceHtm: HTML + 'qualityAssurance.html?type=1', //正品保证


        /**
         * 颜值测试
         */
        faceScore: ROOT + 'faceScore.json',    //颜值测试
        faceScoreExchange: ROOT + 'faceScoreExchange.json',    //颜值测试兑换
        faceScoreExchangeList: ROOT + 'faceScoreExchangeList.json',  //颜值排行榜
        faceScoreTest: ROOT + 'faceScoreTest.htm',    //颜值测试

        /**
         * 下载链接
         */
        downloadHtm: HTML + 'download.html',
        downloadLinkHtm: HTML + 'downloadLink.html',

        /**
         *评论
         */
        itemCommentsPage: ROOT + 'itemCommentsPage.htm',  //添加评论页面
        addComments: ROOT + 'addComments.json',         //添加评论
        addCommentsReply: ROOT + 'addCommentsReply.json',         //回复评论
        commentsList: ROOT + 'commentsList.json',         //评论列表
        commentsReplyList: ROOT + 'commentsReplyList.json',         //回复评论列表
        getCommentsCount: ROOT + 'getCommentsCount.json',        //评论统计
        addCommentsPic: ROOT + 'addCommentsPic.json',        //评论上传单张图片
        uploadCommentPic: ROOT + 'uploadCommentPic.json',        //评论上传多张图片
        uploadCommentPics: ROOT + 'uploadCommentPics.json',        //评论上传多张图片
        wordOfMouthPage:ROOT +'wordOfMouthPage.htm',        //全部口碑

        /**
         * 退货
         */

        getReturnGoodsVOList: ROOT + 'getReturnGoodsVOList.json',     //获取全部退货退款列表(包括可退货和退货列表)
        confirmReturnGood: ROOT + 'confirmReturnGood.json',         //确认退货
        reqReturnGood: ROOT + 'reqReturnGood.json',         //申请退货
        reqReturnGoodAbnormal: ROOT + 'reqReturnGoodAbnormal.json',         //异常申请退货
        expressReturnGood: ROOT + 'expressReturnGood.json',         //退货发快递(退货中)
        returnPolicy: HTML + 'returnPolicy.html?type=1',       //退货政策
        reqReturnGoodPage: ROOT + 'reqReturnGoodPage.htm',       //退货列表
        returnGoodFlowPage: ROOT + 'returnGoodFlowPage.htm',       //退货流程
        uploadReturnGoodsPic:ROOT + 'uploadReturnGoodsPic.json',   //退货申请上传图片

        /**
         * 众筹
         */
        getCrowdfundList:ROOT + 'getCrowdfundList.json',   //众筹列表
        getCrowdfundInfo:ROOT + 'getCrowdfundInfo.json',   //众筹详情
        getCrowdfundItemList:ROOT + 'getCrowdfundItemList.json',   //众筹详情我要支持页
        getCrowdfundTradeList:ROOT + 'getCrowdfundTradeList.json',   //我的项目
        crowdfundHomePage:ROOT + 'crowdfundHomePage.htm',   //众筹首页
        crowdfundInfoPage:ROOT + 'crowdfundInfoPage.htm',   //众筹详情
        crowdfundItemListPage:ROOT + 'crowdfundItemListPage.htm',   //我要支持页
        crowdfundPaymentPage:ROOT + 'crowdfundPaymentPage.htm',   //支付页
        mineCrowdfundPage:ROOT + 'mineCrowdfundPage.htm',   //我的项目
        crowdfundListPage:ROOT + 'crowdfundListPage.htm',   //新品排行
        crowdfundBanner:ROOT + 'crowdfundBanner.json',   //获取众筹banner数据

        buyForJoinAgencyPage:ROOT + 'buyForJoinAgencyPage.htm',  //购买99礼包成为代理
        payResult : ROOT + 'payResultPage.htm',//支付结果页面
        joinAgencySuccess:ROOT + 'joinAgencySuccessPage.htm',//成功成为代理的页面
        howToView: HTML + 'howToView.html?type=1',//支付宝到账查看
        beJoinAgencyGift  :ROOT + 'beJoinAgencyGift.htm',  //如何成为推广经理

        marketSpreadPage: ROOT + 'marketSpreadPage.htm',//营销推广页面,
        posterSpreadPage: ROOT + 'posterSpreadPage.htm',//海报推广页面,
        inviteSpreadMangerPage: ROOT + 'inviteSpreadMangerPage.htm', //邀请成为推广经理
        receiveInviteSpreadMangerPage: ROOT + 'receiveInviteSpreadMangerPage.htm',//邀请成为推广经理接收
        howToMakeMoney:HTML + 'howToMakeMoney.html?type=1',         //如何赚钱

        mbhyymszcPage: ROOT + 'mbhyymszcPage.htm',//美博会一元秒杀页面
        concernWeixin:'http://mp.weixin.qq.com/s?__biz=MzIxNTIxNTQzOA==&mid=403685351&idx=1&sn=3c885e6ab6cff8ae66872d6d8ab49784#rd',  //关注微信公众号
        myParentUser:ROOT + 'myParentUser.json',  //是否有上级

        /**
         * 物流信息
         **/
        logisticsInfoPage:ROOT + 'logisticsInfoPage.htm?type=1',//物流信息
        searchLogisticsCallBack : ROOT + 'searchLogisticsCallBack.json', //物流信息

        /**
         * 刮刮卡
         */
        scratchCard:            ROOT + 'scratchCard.json',//刮刮卡兑奖
        getMyScratchCardList:   ROOT + 'getMyScratchCardList.json',//刮刮卡兑奖列表

        activeTopicPage:        ROOT + 'activeTopicPage.htm?isApp=1',

        /*扫码*/
        //receiveScanCodeCash:    ROOT+'receiveScanCodeCash.json',//用户扫码
        //getMyScanCodeCashList:  ROOT+'getMyScanCodeCashList.json',//获取我的扫码列表
        receiveScanCodeCash:    ROOT+'receiveScanCodeCash.json',//用户扫码
        getMyScanCodeCashList:  ROOT+'getMyScanCodeCashList.json',//获取我的扫码列表

        //二维码接口
        qrUrl:                  ROOT + 'qrUrl.json?url=',

        upYunUploadPics:ROOT + 'upYunUploadPics.json',//upyun评论上传多张图片
        upYunUploadPic:ROOT + 'upYunUploadPic.json',//upyun评论上传单张图片
        upyunDeleteFile:ROOT + 'upyunDeleteFile.json',//upyun删除单张图片
        upYunUploadPicByUrl:ROOT + 'upYunUploadPicByUrl.json',//upyun根据url上传单张图片






    };

    return URL;
});
