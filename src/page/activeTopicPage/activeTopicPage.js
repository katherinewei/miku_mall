/**满立减
 * Created by xiuxiu on 2016/4/11.
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/loadImage',
    'h5/js/common/nexter',
    'h5/js/common/goods',
    'h5/js/common/cart',
    'h5/js/common/weixin',
    'h5/js/common/url',
    'h5/js/common/banner',
    'h5/js/common/transDialog'
], function ($, Data, Common,LoadImage, Nexter,  Goods, Cart, WeiXin, URL,Banner,Dialog) {

    var Page,
        CateTabs,
        dialog,
        Cates = Storage.Cates.get(),

        isApp = URL.param.isApp,
        topicId = URL.param.topicId,
        parameter = '',
        firstLoad = true;
    function init() {
        render();
        //Common.to_Top('#listPage');//返回顶部
    }

    function render() {

        Page = $('<div id="listPage"> <section  id="_listPage"><div class="scroll-content"><div class="banner pic-carousel" id="banner" data-banner="418"><img src=""/> </div><div class="page-list-tabs"></div></div></section></div>').appendTo('body');

        Common.headerHtml('','<div class="category-handle cart-bar" href="' + URL.cart + '"><span class="price"></span></div>',false,'#listPage');

        bindEvents();
        renderCate();

    }
    function bindEvents() {
        Page.on('tap', '.icon-return', function (event) {
            event.preventDefault();
            Common.returnPrePage();
        }).on('tap', '.add-cart', function (event) {
            event.preventDefault();

            var id=$(this).parents('.goods').data('id'),
                price = parseFloat($(this).parents('.goods-info').find('.price').text());

           if(!isApp){
               URL.assign(decodeURI('http://test.unesmall.com/api/h/1.0/activeTopicPage.htm?topicId='+topicId+'&id='+id+'&price='+price+'&parameter='+parameter));
               addCart($(this),true);
           }else{
               addCart($(this));
           }

        }).on('transitionend', '.adding', function(event) {
            $(this).removeClass('adding');
        }).on('tap', '[href]', function (event) {
            event.preventDefault();
            Common.addPUserId($(this));
        })//.on('tap', '.navbar-left span', function (event) {
        //    event.preventDefault();
        //    $(this).removeAttr('href');
        //    URL.assign(URL.index);
        //})//.on('swipeUp', '.page-tabs-panel', function(event) {
        //    console.log(event);
        //    event.preventDefault();
        //    var $this = $(this);
        //    //setTimeout(function() {
        //    //    $('.navTit', Page).removeClass('showNav');
        //    //}, 0);
        //
        //    var nav = $('.navTit', Page);
        //    console.log($this.offset().top)
        //    if (nav.hasClass('showNav') && $this.offset().top > 0) {
        //        nav.removeClass('showNav');
        //    }
        //}).on('swipeDown', '.page-tabs-panel', function(event) {
        //    console.log(event);
        //    event.preventDefault();
        //    setTimeout(function() {
        //        $('.navTit', Page).addClass('showNav');
        //    }, 0);
        //    var nav = $('.navTit', Page);
        //    var $this = $(this);
        //    console.log($this.offset().top)
        //    if (nav.hasClass('showNav') && $this.offset().top < 0) {
        //        nav.removeClass('showNav');
        //    }
        //})
    }


    function renderCate() {
        var wrapTemplate = '<div class="page-tabs-panel" data-role-scrollable="true"><ul class="goods-list grid"></ul></div>';

        var content = $('.page-list-tabs', Page).html(wrapTemplate);


        var data = {
            topicId:topicId
        }

        if ($('.page-tabs-panel').offset().top < $(window).height()*1.5 && firstLoad) {
            renderCateNexter(data);
            firstLoad = false;
        }

        if(!isApp){
            $('.header').hide();
            $('.header .category-handle').remove();
            $('#_listPage').append('<div style="opacity: 0;z-index: -1" class="category-handle cart-bar" href="' + URL.cart + '"><span class="price"></span></div>');
            $('.banner').css('padding-top',0)
        }
    }

    function renderCateNexter(data) {
            var element = $('#_listPage');
            var nexter = new Nexter({
                element: element,
                dataSource: Data.fetchItems,
                enableScrollLoad: true,
                scrollBodyContent: $('.page-tabs-panel ul'),
                data: data,

                //pageSize:16
            }).load().on('load:success', function(res) {
                //console.log(res);

                var html = htmlItems(res.items);
                $('#banner img').attr('src',res.topicDO.picUrls);
                $('.navbar-main').text(res.topicDO.name);
                document.title = res.topicDO.name
                parameter = res.topicDO.parameter;

                element.show();
                //element.show().css('height','690px');
                if (html.length) {
                    this.$('.goods-list').append(html.join(''));


                    LoadImage(this.element);
                    //refreshCart();
                } else if (this.get('pageIndex') == 0) {
                    this.$('.goods-list').html('<li class="not-has-goods-msg"><img src="'+URL.imgPath+'/common/images/loading_fail.png"/><p>灰常抱歉，暂时没有数据哦</p> </li>');
                }


            }).render();

            var sid,
                scrollEventHandle = function(event) {
                    event.preventDefault();
                    clearTimeout(sid);
                    sid = setTimeout(function() {
                        LoadImage(element);
                    }, 0);
                }
            element.on('scroll', scrollEventHandle);

    }

    function htmlItems(items) {
        var template = '<div class="goods col col-50" data-id="{{itemId}}"><div class="listimg" href="' + URL.goodsDetail + '?gid={{itemId}}" tj_category="商品" tj_action="{{title}}"><img data-lazyload-src="{{listimg}}" />{{soldOut}}{{_htmlFlagS}}</div><div class="goods-info"><h1><span class="title">{{title}}</span><span class="spec">{{_htmlLimit}}</span><span class="no-post-fee">{{noPostFee}}</span></h1><p><span class="price">{{_htmlPrice}}</span><span class="refprice">{{_htmlRelPrice}}</span><span class="discount {{discountClass}}">{{discount}}折</span></p><p class="brokeFee {{brokerageFeehide}}">推广费：<span class="price">{{brokerageFee}}</span></p><div class="soldnum"><div style="width:{{threshold}}%"></div><p>已售{{saleTotal}}件</p></div><a class="add-cart {{soldOutCartState}}"></a><div class="count">{{cartCount}}</div></div>{{_htmlFlag}}</div>',
            html = [],
            _index = 0;


        if ($.isArray(items) && items.length) {

            $.each(items, function(index, item) {
                //console.log('list',item.brokerageFee,item.itemId);
                if (index % 2 == 0) {
                    html.push('<li class="row">');
                }
                var goods = Goods.create(item);
                (item.isTaxFree == 1)  ? goods._htmlFlag = '<div class="goods-flag"><img class="flag-taxFree" src="'+URL.imgPath+'common/images/icon_label_dutyFree.png" /></div>' : '';
                html.push(bainx.tpl(template, goods));
                if (index % 2 == 1) {
                    html.push('</li>');
                }
                _index = index;



            });
            if (_index % 2 == 0) {
                html.push('<div class="col col-50 goods goods-null fb fvc fac"></div></li>');
            }
        }
        refreshCart();
        return html;
    }

    function addCart(btn,_isapp) {
        var view = btn.parents('.goods'),
            gid = view.data('id'),
            item = Cart.query(gid) || Cart.create(Goods.query(gid));

        if (item) {
            item.add({
                btn: btn,
                start: function(newCount) {
                    btn.addClass('adding');
                    view.find('.count').text(newCount);

                    var offset = $(".category-handle").offset(),
                        cloneViewOffset = $('.listimg', view).offset(),
                        imgUrl = view.find('.listimg').children('img').attr('src'), //获取当前点击图片链接
                        flyerWidth = $('.listimg img', view).width(),
                    //flyerHeight = $('.listimg img', view).height(),
                        flyer = $('<div class="listimg move-wrap"><img class="flyer-img" src="' + imgUrl + '"></div>'); //抛物体对象

                    flyer.find('.flyer-img').width(flyerWidth);
                    //flyer.find('.flyer-img').height(flyerHeight);
                    console.log(offset);

                    flyer.fly({
                        start: {
                            left: cloneViewOffset.left,//抛物体起点横坐标
                            top: cloneViewOffset.top //抛物体起点纵坐标

                        },
                        end: {
                            left: offset.left + 10,//抛物体终点横坐标
                            top: offset.top + 10, //抛物体终点纵坐标
                            width: 10,
                            height: 10
                        },
                        speed: 1.2,
                        vertex_Rtop: 50, //运动轨迹最高点top值，默认20
                        onEnd: function () {
                            //$("#tip").show().animate({width: '200px'},300).fadeOut(500);////成功加入购物车动画效果
                            this.destory(); //销毁抛物体
                        }
                    });

                },
                count: 1,
                view: view,
            },_isapp).always(function(res) {
                item.count > 0 ? view.find('.count').text(item.count).css({visibility: "visible"}) : view.find('.count').css({visibility: "hidden"});
                refreshCart();

            }).fail(function(json) {

                if (item.goods.flag.immediatelyBuy) {
                    URL.assign(URL.goodsDetail + '?gid=' + item.id);
                } else {
                    alert(json && json.msg || '同步购物车失败或者您尚未登陆！');

                    if (!item.goods.itemNum) {
                        Cart.removeItem(item);
                    }
                }

            });
        }
    }

    function refreshCart() {
        Common.getCartCount();
        Common.isLogin && Cart.ready(function() {

//            renderSmallCart();
//            refreshListCount();
        });

    }

    init();
})