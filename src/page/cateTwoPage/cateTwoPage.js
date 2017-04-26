require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/loadImage',
    'h5/js/common/banner',
    'h5/js/common/cart',
    'h5/js/common/weixin',
    'h5/js/common/url'
], function ($, Data, Common,  LoadImage,  Banner,  Cart, WeiXin, URL) {


    var Page,
        list,
        activity,
        Cates,
        cateParentId = URL.param.categoryId,
        name = URL.param.categoryName;


//

    function init() {
        render();

        Common.to_Top('#subcategory');//返回顶部


    }


    function render() {
        Common.headerHtml(name);
        var header = '<section id="subcategory" class="page-content"><div class="banner pic-carousel" id="banner" data-banner="418"></div><div class="list grid"><div class="row"><div class="listitem"></div></div></div><div class="activity" data-banner="421"></div></section>';
        Page = $(header).appendTo('body');

        actiSep();
        bindEvent();
        Common.renderAppBar();
        $('#app-bar li:nth-child(2)').addClass('active');
        Common.isLogin && Cart.ready(); //获取购物车总数
    }
    //活动
    function actiSep() {

        var ids = [];
        Page.find('[data-banner]').each(function () {
            ids.push($(this).data('banner'));
        });
        var data = {
            categoryId: cateParentId,
            k: ids.join(',')
        }

        Data.categoryBanner(data).done(function (res) {

            console.log(res);
            //渲染页面banner位置
            if ($.isPlainObject(res.banners)) {
                var createHtml = function (banners, template, className, showText) {
                    var listTemplate = [],
                        html = [],
                        secListTemplate = '<div class="item" href="{{href}}"><div class=""> <img data-lazyload-src="{{img}}" /><span class="{{shadows}}"></span></div><div class="textWrap clearfix {{is_show}}"><span class="ellipsis">{{title}}</span><em>{{remains_time}}</em></div></div>';
                    listTemplate[421] = secListTemplate,
                        banners.forEach(function (item, index) {
                            item.nowTime = res.nowTime;
                            if (className) {
                                item.className = className;
                            }
                            html.push((new Banner(item)).html(listTemplate[template]));
                        });
                    return html.join('');
                };
                $.each(res.banners, function (key, banners) {

                    switch (key) {
                        case '418': //顶部活动位
                            initBannerSlider(banners, res.cid);
                            break;

                        case '421': //活动
                            if (banners.length > 0) {
                                $('.activity').append('<h3><span class="line"></span><b>超值专场</b></h3><div class="items"></div>');
                            }
                            Page.find('.items').html(createHtml(banners, key));
                            break;


                    }
                });
                LoadImage(Page);

                var sid,
                    scrollEventHandle = function (event) {
                        event.preventDefault();
                        clearTimeout(sid);
                        sid = setTimeout(function () {
                            LoadImage(Page);
                        }, 100);
                    }
                Page.on('scroll', scrollEventHandle);
            }
            if ($('.banner .slider-outer').length == 0) {
                $('.banner').css({'min-height': '0px'})
            }
        });
        category();
    }
    //分类
    function category() {
        console.log(cateParentId);
        var data = {
            cateParentId: cateParentId,
            level: 2
        };
        Data.fetchCatesByParams(data).done(function (res) {

            if (res.cates) {

                Cates = res.cates;
                if (Cates.length > 0) {
                    _renderHtml(Cates);
                } else {
                    $('.list .listitem').html('<div class="not-has-cate-msg">暂时没有该分类...</div>');
                }

            }
        });
    }

    function _renderHtml(cates) {

        var template = '<dl class="col col-25" data-id="{{categoryId}}"><dt><img data-lazyload-src="{{pic}}" /></dt><dd class="ellipsis">{{name}}</dd></dl>',
            html = [];

        $.each(cates, function (index, cate) {
            html.push(bainx.tpl(template, cate));
        });

        $('.list .listitem', Page).html(html.join(''));
        setTimeout(function () {
            LoadImage(Page);
        }, 0);
    }

    //
    function bindEvent() {
        Page.on('tap', '.listitem dl', function (event) {
            event.preventDefault();
            var cid = $(this).data('id');
            console.log(cid);
            location.href = URL.list + '?cid=' + cid + '&name=' + $(this).children('dd').text();
        }).on('tap', '.icon-return', function (event) {
            event.preventDefault();
            Common.returnPrePage();
        }).on('tap', '[href]', function (event) {
            event.preventDefault();
            Common.addPUserId($(this));
        });
    }

    function initBannerSlider(banners) {
        var template = '<li class="{{className}}" href="{{href}}" ><img dataimg="{{img}}" class="lazyimg" ></li>',
            html = ['<div class="slider-outer"><ul class="clearfix slider-wrap">'],
            target = Page.find('.banner');
        banners.forEach(function (item, index) {
            html.push((new Banner(item)).html(template));
        });
        var len = banners.length;

        html.push('</ul></div><div class="carousel-status"><ul></ul></div>');
        target.html(html.join('')).show();


        //if (len > 1) {
            require('slider', function (Slider) {

                Slider({
                    slideCell:"#banner",
                    titCell:".carousel-status ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                    mainCell:".slider-outer ul",
                    effect:"leftLoop",
                    autoPlay:true,//自动播放
                    autoPage:true, //自动分页
                    switchLoad:"dataimg" //切换加载，真实图片路径为"_src"
                });
            });
        //} else {
        //    var img = $('img', target);
        //    img.attr('src', img.attr('dataimg')).removeAttr('dataimg');
        //}
    }
    init();
})