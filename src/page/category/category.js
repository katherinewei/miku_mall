require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/nexter',
    'h5/js/common/tabs',
    'h5/js/common/goods',
    'h5/js/common/loadImage',
    'h5/js/common/cart',
    'h5/js/common/storage',
    'h5/js/common/banner'
], function ($, URL, Data, Common, Nexter, Tabs, Goods, LoadImage, Cart, Storage, Banner) {



    var Page,
        catePage,
        Cates = Storage.Cates.get();



    function init() {
        render();
        var q = URL.param.q;
        console.log(q);
        if (q) {
            itemSearchSuggest(q);
        }
    }



    function render() {

        renderSearch();

        renderCategory();

        renderBanner();


        Common.isLogin && Cart.ready(); //获取购物车总数

        bindEvent();

    }

    //搜索
    function renderSearch() {
       // Common.headerHtml('分类','',true);


        var template = '<section class="header"><div class="content navbar"><div class="search-wrap"><div class="row search-box"><div class="icon-search search-submit"></div><div class="input-wrap"><input type="text" class="search-input" placeholder="搜索"/></div><div class="icon-wrap" style="display: none;"><i class="icon-close"></i></div></div></div></div></section><section class="grid page-content page-category" id="catePage"><div class="banner pic-carousel" data-banner="418" style="display: none;"></div><div class="row category-wrap" data-banner="419"><ul class="list"></ul></div><div class="all-cart"></div> <div class="cate-section cata-4"><h3 class="title">推荐品牌</h3><div class="row brand-wrap" data-banner="420"><ul class="list"></ul></div></div></section>';

        //var template = '<section class="header"><div class="content navbar"><div class="navbar-main">分类</div><!--<div class="search-wrap"><div class="row search-box"><div class="icon-search search-submit"></div><div class="input-wrap"><input type="text" class="search-input" placeholder="搜索"/></div><div class="icon-wrap" style="display: none;"><i class="icon-close"></i></div></div></div>--></div></section><section class="grid page-content page-category" id="catePage"><div class="banner pic-carousel" data-banner="418" style="display: none;"></div><div class="row category-wrap" data-banner="419"><ul class="list"></ul></div><div class="all-cart"></div> <div class="cate-section cata-4"><h3 class="title">推荐品牌</h3><div class="row brand-wrap" data-banner="420"><ul class="list"></ul></div></div></section>';

        Page = $(template).appendTo('body');

    }

    //Banner
    function renderBanner() {
        var ids = [],
            data = {
                categoryId: -1,
                moduleType: 2,
                k: ids
            };
        Page.find('[data-banner]').each(function () {
            ids.push($(this).data('banner'));
        });
        if ($.isArray(ids)) {
            data.k = ids.join(',');
        }
        Data.categoryBanner(data).done(function (res) {

            console.log(res);
            //渲染页面banner位置
            if ($.isPlainObject(res.banners)) {
                var bannerTemplate = '<div class="{{className}} addHrefParm" href="{{href}}" tj_category="分类" ><img data-lazyload-src="{{img}}" /></div>',
                    cateTemplate = '<li class="col col-25 item "><a class="addHrefParm" href="{{href}}" tj_category="分类" ><img src="{{img}}" alt=""><strong class="ellipsis">{{title}}</strong></a></li>',
                    brandTemplate = '<li class="{{className}} "><a class="addHrefParm" href="{{href}}" tj_category="分类" tj_action="{{title}}"><img src="{{img}}" /></a></li>',
                    createHtml = function (banners, template, className) {
                        var html = [];
                        banners.forEach(function (item, index) {
                            if (className) {
                                item.className = className;
                            }
                            html.push((new Banner(item)).html(template || bannerTemplate));
                        });
                        return html.join('');
                    };


                $.each(res.banners, function (key, banners) {
                    var html = [];
                    switch (key) {
                        //case '418':
                        //    initBannerSlider(banners, res.cid);
                        //    break;
                        //case '419':
                        //    Page.find('.category-wrap ul').html(createHtml(banners, cateTemplate), 'col col-25 item');
                        //    break;
                        case '420':
                            //todo
                            Page.find('.brand-wrap ul').html(createHtml(banners, brandTemplate, 'col col-25 item'));
                            break;
                    }
                });
            }

            Common.renderAppBar();

            $('.brand-wrap ul li').eq(0).children('a').removeAttr('href');


            setTimeout(function () {
                LoadImage(Page);
            }, 0);

            var sid,
                scrollEventHandle = function (event) {
                    event.preventDefault();
                    clearTimeout(sid);
                    sid = setTimeout(function () {
                        LoadImage(Page);
                    }, 100);
                }
            Page.on('scroll', scrollEventHandle);

        });
    }


    function initBannerSlider(banners, shopId) {
        var template = '<li class="{{className}} addHrefParm" href="{{href}}" ><img dataimg="{{img}}" class="lazyimg" ></li>',
            html = ['<div class="slider-outer"><ul class="clearfix slider-wrap">'],
            target = Page.find('.banner');

        banners.forEach(function (item, index) {
            html.push((new Banner(item)).html(template));
        });
        var len = banners.length;

        html.push('</ul></div><div class="carousel-status">');
        target.html(html.join('')).show();

        if (len > 1) {
            require('slider', function (Slider) {
                var ww = $(window).width();
                $('.page-category .banner, .page-category .banner img').width(ww);

                var slide = new Slider(target, {
                    loop: 1,
                    curIndex: 0,
                    useTransform: 1,
                    lazy: '.lazyimg',

                    slider_num: true,
                    play: true, //动画自动播放
                    interval: 3000,
                    trigger: '.carousel-status',
                    activeTriggerCls: 'sel',
                    hasTrigger: 'tap',
                });
            });
        } else {
            var img = $('img', target);
            img.attr('src', img.attr('dataimg')).removeAttr('dataimg');
        }
        Common.renderAppBar();
        Common.isLogin && Cart.ready(); //获取购物车总数
    }



    //二级类目
    function renderCategory() {

        Data.fetchCates().done(function(res) {

            if(res.cates.length) {

                //var html = htmlLevelParent(res.cates);      //一级
                    $('.all-cart').append(htmlLevelParent(res.cates));


                var categoryId = 0;
                var htmlItems =[];
                $('.cate-sectionItem').each(function() {
                    categoryId = $(this).data('id');

                        $.each(res.cates, function (index, item) {
                            var templateItem = '<li class="col col-25 item " href="' + URL.list + '?cid={{categoryId}}&name={{name}}&level={{level}}" tj_category="分类" tj_action="{{name}}" data-id="{{categoryId}}"><img src="{{pic}}" alt=""><strong class="ellipsis">{{name}}</strong></li>';
                            if(item.level == 2 && item.parentId == categoryId) {       //二级
                                htmlItems.push(bainx.tpl(templateItem, item));
                            }
                        })
                    $(this).find('.list').append(htmlItems.join(''));
                    htmlItems = [];
                })

            }
        });
    }

    function htmlLevelParent(items){
        var html=[],
            template='<div class="cate-sectionItem " data-id="{{categoryId}}"><h3 class="title">{{name}}</h3><div class="row category-wrap"><ul class="list"></ul></div></div>';
        $.each(items, function (index, item) {
            if(item.level == 1){            //一级
                html.push(bainx.tpl(template, item));
            }
        });

        return html.join('');
    }


    function bindEvent() {
        Page.on('tap', '.search-submit', function (event) {
            event.preventDefault();
            var $input = $('.search-input', Page);
            $input.blur();
            var q = $.trim($input.val()+'');

            if(q == ''){
                alert('请输入收索关键字!');
                return false;
            }
            location.href = URL.list+'?q='+q;
        }).on('input', '.search-input', function (e) {

            var $input = $('.search-input', Page);
            var q = $.trim(encodeURIComponent($input.val()));
            if ($input.val() == '') {
                $('.icon-wrap').hide();
            } else {
                $('.icon-wrap').show();
            }
            itemSearchSuggest(q);
        }).on('keyup', '.search-input', function (e) {

            var key = e.which;
            var $input = $('.search-input', Page);
            var q = $.trim($input.val());
            if (key == 13) {
                e.preventDefault();
                if (q == '') {
                    alert('请输入收索关键字!');
                    return false;
                }
                location.href = URL.list + '?q=' + q;
            }
        }).on('keydown', '.search-input', function (e) {
            $('.associateValHtm').remove();
        }).on('tap', '.icon-wrap', function (event) {
            event.preventDefault();
            $('.search-input').val('');
            $('.icon-wrap').hide();
            $('.associateValHtm').hide();
        }).on('tap', '[href]', function (event) {
            event.preventDefault();
            Common.addPUserId($(this));
        });

    }

    function itemSearchSuggest(q) {
        if (q) {
            Data.itemSearchSuggest(q).done(function (res) {
                $('.associateValHtm').remove();
                var html = [],
                    associateValHtm = '<ul class="associateValHtm"></ul>';
                $('.header').after(associateValHtm);
                if (res.length > 0) {
                    $.each(res, function () {
                        var template = '<li><a href="' + URL.list + '?q=' + this +'" >' + this + '</a></li>';

                        html.push(bainx.tpl(template));
                    });
                    $('.associateValHtm').append(html.join(''));
                }
            })
        }
    }
    init();
});
