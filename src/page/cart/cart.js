/**
 *    购物车
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/cart',
    'h5/js/common/goods',
    'h5/js/common/storage',
    'h5/js/common/shop'
], function($, URL, Common, Cart, Goods, Storage, Shop) {



    var Page,
        ShopInfo,
        discountAllPrice = 0,
        topicTotalPrice = 0,//单个商品小计
        topicArr=[],//满减商品的数组
        pUserId = URL.param.pUserId;

    function init() {
        Cart.ready(render);
        Common.renderAppBar();
    }

    function render() {

        Common.headerHtml('','<div class="btn-navbar navbar-right"></div>',true);
        $('.navbar-main').html('购物车<span></span>');

        var template = '<section id="cartPage"><div class="cart-item-list-layout"><ul class="cart-item-list grid"></ul></div><footer class="grid"></footer></scetion>';

        Page = $(template).appendTo('body');

        /*var shopInfo = Storage.ShopInfo.get();
         shopInfo && */
        Shop.ready(function(){
            renderShopInfo(Shop.currentShop());
        })

        bindEvents();

        renderCartItems();

        headerTotal();
    }

    function bindEvents() {
        Page.on('swipeLeft swipeRight longTap', '.cart-item', function(event) {
            event.preventDefault();
            //修复安卓手机左右滑动时最后一个显示不全的bug。
            if (Common.isAndroid) {
                $('.cart-item-list').css({'padding-bottom': '114px'});
            }
            if (event.type === 'swipeRight') {
                hideDeleteMode($(this));
            } else {
                showDeleteMode($(this));
            }
        }).on('tap', '.count-diff, .count-add, .delete,.deleteIcon, .edit-button, .enter, .checkbox', function(event) { //, .all-select
            event.preventDefault();
            if (Common.isAndroid) {
                $('.cart-item-list').css({'padding-bottom': '0px'});
            }
            var target = $(this);
            if (target.hasClass('busy') || target.hasClass('disable')) {
                return;
            }
            if (target.hasClass('count-diff')) {
                var goodsNum = parseInt($(this).siblings('.count').text());
                syncCart(target, -1, '', (goodsNum == 1 ? true : false));
            } else if (target.hasClass('count-add')) {
                syncCart(target, 1);
            } else if (target.hasClass('delete') || target.hasClass('deleteIcon')) {
                syncCart(target, 0, '', true);

            }
            else if (target.hasClass('edit-button')) {
                toggleDeleteMode();
            }
            else if(target.hasClass('enter')){
                var param = Cart.getCheckItemsParam();
                if(!param){
                    alert('请选择要购买的商品！');
                    return;
                }
                if(Cart.isApproveStatus()){
                    URL.assign(URL.placeOrder + '?from=cart&goods=' + encodeURIComponent(param)+'&pUserId='+URL.param.pUserId);
                }else{
                    var msg = [];
                    Cart.forEachApproveStatus(function(id, item){
                        msg.push(item.goods.title);
                    })
                    if(confirm(msg.join()+ '已下架,需要删除这些商品吗？')){
                        Cart.forEachApproveStatus(function(id, item){
                            syncCart($('.goods[data-id="' + item.id + '"]').find('.delete'), 0, 'noConfirm', true);
                        });
                    }
                }
            }
            else if(target.hasClass('checkbox') ){
                target.toggleClass('checked');
                var cid = target.parents('.cart-item').data('id'),
                    cartItem = Cart.query(cid);

                cartItem && cartItem.toggleCheck();

                var topic_items = topicArr[target.parents('.topic_list ').data('id')];

                var topic_itemsAll = topicArr;

                if(target.hasClass('all-select')){
                    if(target.hasClass('checked')){
                        $('.goods .checkbox', Page).addClass('checked');

                       Cart.toggleCheckAll(true);

                        if($('.cart-item-list').find('.topic_list').length > 0){
                            //优惠信息
                            //将全部商品的list.checked变为true

                            for(var c in topic_itemsAll){
                                for(var i in topic_itemsAll[c].list){
                                    topic_itemsAll[c].list[i].checked = true;
                                }
                            }
                        }

                    }else{
                        $('.goods .checkbox', Page).removeClass('checked');
                        Cart.toggleCheckAll(false);

                        if($('.cart-item-list').find('.topic_list').length > 0){
                            //将全部商品的list.checked变为false
                            for(var c in topic_itemsAll){
                                for(var i in topic_itemsAll[c].list){
                                    topic_itemsAll[c].list[i].checked = false;
                                }
                            }
                        }
                    }
                    //遍历所有优惠信息---以防出错------
                    $('.topic_list').each(function(){
                        var topic_itemA = topicArr[$(this).data('id')];
                        var viewA =  $(this).find('.cart-item');
                        viewA.each(function(){
                            topicParam(topic_itemA,$(this),true);
                        })
                    })

                }else{
                    //不是全选，计算优惠信息

                    //if(target.parents('.topic_list').length > 0){


                    //已选数量
                    var hasCkeckNum = target.parents('.topic_list').find('.checked').length;

                    target.parents('.topic_list').find('.lit_count').children('b').text(hasCkeckNum);

                    //将已选list.checked变为false
                    var  hasChecked;
                    if(target.hasClass('checked')) {
                        hasChecked= true;
                    }else {
                        hasChecked = false;
                    }
                    if(topic_items) {
                        for (var i in topic_items.list) {
                            if (cid == topic_items.list[i].itemId) {
                                topic_items.list[i].checked = hasChecked;
                            }
                        }
                        var view = target.parents('.cart-item')
                        topicParam(topic_items,view,true);
                    }else{
                        if($('.diso').hasClass('hide')){            //如果优惠没显示，以下不执行
                            var _allSumN = parseFloat(Cart._sum/ 100) > 999 ? '999+' : parseFloat(Cart._sum/ 100);
                            $('#app-bar .cart-bar .price').text(_allSumN);
                            return
                        }
                        var _allSum = parseFloat((Cart._sum/ 100).toFixed(2) - discountAllPrice);

                        $('.sumTotal em').text(_allSum.toFixed(2));
                        _allSum = _allSum > 999 ? '999+' :_allSum;
                        $('#app-bar .cart-bar .price').text(_allSum);
                    }
                }
            }

            // }

        }).on('tap', '[href]', function (event) {
            event.preventDefault();
            Common.addPUserId($(this));
        });
        $('body').on('tap','.edit',function(event){
            event.preventDefault();
            editDialog($(this));
        }).on('tap','.deleteBtn',function(event){
            event.preventDefault();
            // console.log('删除')
            deleteSelect();
        });
        Cart.on('change:sum',function(sum){
            $('.small-cart .price').html(Common.moneyString(sum));
        }).on('change:total',function(total){
            $('.small-cart .sum-goods-count').html('('+total+')');
        });
        /*.on('tap', '.cart-item', function(event) {
         event.preventDefault();
         var target = $(event.target);
         if (!(target.hasClass('count-diff') || target.hasClass('count-add') || target.hasClass('delete'))) {
         $(this).toggleClass('checked');
         }
         });*/
    }


    //头部购物车数量
    function headerTotal(){
        var list_l = $('.cart-item-list .cart-item').length; //购物车总数量
        if(list_l == 0){
            $('.navbar-main span').hide();
        }else{
            $('.navbar-main span').append('(<em>'+list_l+'</em>)');
        }
    }

//无商品
    function renderEmptyCart(is_refresh, is_del) {
        var cart_goods_count = $('.cart-item-list .cart-item').length,
            goods_count = parseInt($('.goods-info .count').html());

        if (cart_goods_count == 0 || (is_refresh && cart_goods_count == 1 && is_del && goods_count == 0)) {
            $('.cart-item-list', Page).html('<li class="cart-empty" href="' + URL.index + '"><img src="' + URL.imgPath + '/common/images/cart_empty.png" ><div  >去逛逛</div></li>');
            $('#app-bar').removeClass('has-items');
            $('#cartPage footer').remove();
        }
    }

    function renderSmallCart(option) {
        var wrap = $('footer', Page);
        Cart.renderSmallCart({
            wrap: wrap,
            submitText: '结算',
            href: '',
            is_del: option && option.is_del
        });


        if (Cart.total) {
            wrap.addClass('show');
            $('#app-bar').addClass('has-items');

            if(discountAllPrice > 0) {
                $('.diso').removeClass('hide');
                $('.sumTotal').addClass('lineH');
                $('.diso .discountAll').text(discountAllPrice.toFixed(2));
            }else{
                $('.diso').addClass('hide');
                $('.sumTotal').removeClass('lineH');
            }
            if($('#cartPage').find('.checked').length == 0){
                $('.diso').addClass('hide');
                $('.sumTotal').removeClass('lineH');
                // $('.sumTotal em').text('0.00');
                $('#app-bar .cart-bar .price').text('0');
            }else{

                var _allSum = parseFloat((Cart._sum/ 100).toFixed(2) - discountAllPrice);

                $('.sumTotal em').text(_allSum.toFixed(2));
                _allSum = _allSum > 999 ? '999+' :_allSum;
                $('#app-bar .cart-bar .price').text(_allSum);

            }


        } else {
            wrap.removeClass('show');

            renderEmptyCart();
        }
    }

    function renderShopInfo(shopInfo) {
        //var template = '<div class="row"><h1 class="col shop-info fb fvc fac">' + shopInfo.name + '</h1></div>';
        //var template = '<div class="row"><h1 class="col shop-info fb fvc fac">购物车</h1></div>';
        ////<div class="edit-button col col-3 fb fvc far pr-10">编辑</div>
        //Page.find('.header').html(template);
    }

    function renderCartItems() {
        var template = '<div class="cart-item goods row" data-id="{{id}}" data-topicid="{{topicId}}"><div class="delete"></div><div class="goods-view row"><div class="col col-3 fb fvc fac"><div class="checkbox checked"></div></div><div class="col col-5 fb fvc fac imgBox" href="{{itemUrl}}"><img src="{{img}}" /></div><div class="col col-14 pl-10 fb"><div class="goods-info"><h3 class="pb-05">{{title}}{{specification}}</h3>{{countbox}}</div></div><div class="col col-5 fb fvc"><div class="pb-05 Mon"><del class="price pl-05">{{relPrice}}</del><span class="price goodsPrice" data-total="{{total_item}}">{{price}}</span><div class="deleteIcon"></div></div></div></div></div></div>',
            html = [],

            tpl = '<li class="list"></li>';
        topicArr = Cart.topicArr;

        Cart.forEach(function(key, item) {

            var data = {
                id: item.id,
                topicId: item.goods.topicId,
                title: item.goods.title,
                specification: item.goods.specification,
                img: item.goods.listimg,
                price: item.goods._htmlPrice,
                relPrice: item.goods._htmlRelPrice,
                count: item.count,
                itemUrl: URL.goodsDetail + '?gid=' + item.id,
                topicParameter:item.goods.topicParameter,
                name:item.goods.topicName,
                checked:item.checked,
                countbox: (item.goods.approveStatus ? ('<div class="count-box"><a class="count-diff">-</a><a class="count">' + item.count + '</a><a class="count-add">+</a></div>') : '<div class="approve">已下架</div>')
            }


            if(!data.topicId){
                html.push(bainx.tpl(template, data));
            }
        });

        if(topicArr) {
            var topicTpl = '<li class="topic_list " data-id="{{id}}"><div class="title row" id="topic_title_{{id}}"> <div class="col col-18"><span class="icon">满减</span><span class="name">{{name}}</span><span class="discount {{hide}} pl-5"><b >已优惠</b><span class="price" data-hascousnt="{{hasDiscounted}}">{{hasDiscounted}}</span></span> </div> <div class="col col-5 fb fac" href="'+URL.activeTopicPage+'&topicId={{id}}">查看活动></div></div><div class="total_b row"><div class="col col-18"><span class="lit_count pr-10">共<b>{{count}}</b>件商品</span><span>合计：<b class="price list_sum">{{total}}</b><b class="price noPrice hide">0</b></span><p class="achieve">购满<b class="price">{{topicParameterJMin}}</b>,最高立减<b class="price">{{topicParameterJValue}}</b></p></div><div class="col col-5 fb fac fvc buyBtn {{hideBuy}}" href="'+URL.activeTopicPage+'&topicId={{id}}">去凑单></div> </div> </li>';

            for (var i in topicArr) {

                var topic_item = topicArr[i],

                    itemI = topic_item.list;

                var topic_items = topicArr[topicArr[i].id];


                topicParam(topic_items);
                topic_item.total = topic_item.total / 100;

                topic_item.total = (topic_item.total - topic_items.hasDiscounted).toFixed(2);

                // console.log(topic_item);

                var list_html = bainx.tpl(topicTpl, topic_item),
                    cart_i = [];
                $('.cart-item-list', Page).append(list_html);

                for(var z in itemI){
                    var item =  itemI[z];
                    var data = {
                        id: item.itemId,
                        topicId: item.topicId,
                        title: item.title,
                        specification: item.specification,
                        img: item.listimg,
                        price: item._htmlPrice,
                        relPrice: item._htmlRelPrice,
                        count: item.cartCount,
                        itemUrl: URL.goodsDetail + '?gid=' + item.itemId,
                        topicParameter:item.topicParameter,
                        name:item.topicName,
                        checked:item.checked,
                        countbox: (item.approveStatus ? ('<div class="count-box"><a class="count-diff">-</a><a class="count">' + item.cartCount + '</a><a class="count-add">+</a></div>') : '<div class="approve">已下架</div>')
                    }


                    item.total_item = data.price * data.count;
                    cart_i.push(bainx.tpl(template, data));
                }

                $('#topic_title_'+topic_item.id).after(cart_i.join(''));

                var hasDiscounted = topic_items.hasDiscounted == '' ? 0 :parseFloat(topic_items.hasDiscounted);
                discountAllPrice += hasDiscounted;

            }

        }
        if(html.length || $('.topic_list').length > 0) {
            $('.cart-item-list', Page).append(tpl);
            $('.list', Page).append(html.join(''));
            setTimeout(renderSmallCart, 0);

        } else {
            renderEmptyCart();
        }




    }

    //优惠参数
    function topicParam(topic_items,target,flag) {

        var topicParameterJMin,
            topicParameterJValue,
            hasDiscounted,
            totalPrice = 0,
            hide;
        var tpList = topic_items.list;

        //计算已选商品的价格
        for (var k in tpList) {
            if (tpList[k].checked) {
                totalPrice += tpList[k].price * tpList[k].cartCount;
            }
        }

        if (topic_items.topicParameter) {
            var topicParameterS;
            topicParameterS = JSON.parse(topic_items.topicParameter);

            var topicParameterSLength = topicParameterS.length;

            //计算优惠信息
            for (var j = topicParameterSLength - 1; j >= 0; j--) {
                if (totalPrice >= topicParameterS[j].min) {
                    topicParameterJMin = j == topicParameterSLength - 1 ? topicParameterS[j].min : topicParameterS[j + 1].min;
                    topicParameterJValue = j == topicParameterSLength - 1 ? topicParameterS[j].value : topicParameterS[j + 1].value;

                    if (j == topicParameterSLength - 1) {
                        topic_items.hideBuy = 'hide';
                        if(flag){
                            target.parents('.topic_list').find('.buyBtn').addClass('hide');
                        }
                    }else{
                        if(flag){
                            target.parents('.topic_list').find('.buyBtn').removeClass('hide');
                        }
                    }

                    hasDiscounted  = j == 0 ? hasDiscounted = topicParameterS[0].value :  hasDiscounted = topicParameterS[j].value

                    hide = '';
                    break;
                }
                if (topicTotalPrice < topicParameterS[0].min) {
                    topicParameterJMin = topicParameterS[0].min;
                    topicParameterJValue = topicParameterS[0].value;
                    hasDiscounted = '';
                    hide = 'hide';
                    topic_items.hideBuy = '';
                    if(flag){
                        target.parents('.topic_list').find('.buyBtn').removeClass('hide');
                    }
                }
            }
        }

        topicParameterJMin = topicParameterJMin / 100;
        topicParameterJValue = topicParameterJValue / 100;
        hasDiscounted = hasDiscounted / 100;
        totalPrice = (totalPrice / 100).toFixed(2);

        topic_items.topicParameterJMin = topicParameterJMin;
        topic_items.topicParameterJValue = topicParameterJValue;
        topic_items.hasDiscounted = hasDiscounted;
        topic_items.hide = hide;


        if (flag) {
            if (target.parents('.topic_list').find('.total_b').length > 0 ) {

                var discountC = target.parents('.topic_list ').find('.discount'),
                    list_sumC = target.parents('.topic_list ').find('.list_sum');

                if (discountC.hasClass('hide')) {            //是否之前已有优惠隐藏则没有
                    if (hide == 'hide') {
                        list_sumC.text(totalPrice);
                    } else {
                        list_sumC.text((totalPrice - hasDiscounted).toFixed(2))       //减去优惠得到的价格
                        discountC.removeClass('hide');      //提示优惠信息
                        discountC.children('.price').text(hasDiscounted);
                    }

                } else {                      //之前已有优惠
                    if (hide == 'hide') {         //没有优惠了
                        list_sumC.text(totalPrice)       //总价应加上之前优惠的
                        discountC.addClass('hide');
                    } else {
                        list_sumC.text((totalPrice - hasDiscounted).toFixed(2));
                        discountC.removeClass('hide');
                        discountC.children('.price').text(hasDiscounted);

                    }
                }

                //优惠信息区间改变
                target.parents('.topic_list').find('.achieve b:first-child').text(topicParameterJMin);
                target.parents('.topic_list').find('.achieve b:nth-child(2)').text(topicParameterJValue);

                discountAllPrice = 0;//总优惠价

                $('.topic_list').each(function () {
                    if(!$(this).find('.discount').hasClass('hide')){
                        var dis = parseFloat($(this).find('.discount').children('.price').text());
                        discountAllPrice += dis;
                    }
                })

                if(discountAllPrice > 0) {
                    $('.diso').removeClass('hide');
                    $('.sumTotal').addClass('lineH');
                    $('.diso .discountAll').text(discountAllPrice.toFixed(2));
                }else{
                    $('.diso').addClass('hide');
                    $('.sumTotal').removeClass('lineH');
                }

                var _allSum = parseFloat((Cart._sum/ 100).toFixed(2) - discountAllPrice);

                $('.sumTotal em').text(_allSum.toFixed(2));
                _allSum = _allSum > 999 ? '999+' :_allSum;
                $('#app-bar .cart-bar .price').text(_allSum);

            }
        }
    }


    function showDeleteMode(view) {
        view.addClass('moveleft');
        $(document).one('tap', hideDeleteMode);
    }

    function hideDeleteMode() {
        $('.moveleft', Page).removeClass('moveleft');
    }

    function toggleDeleteMode() {
        $('.cart-item', Page).toggleClass('moveleft');
    }

    function syncCart(btn, count, noConfirm, is_del) {

        var view = btn.parents('.cart-item'),
            gid = view.data('id'),
            item = Cart.query(gid) || Cart.initItem(Goods.query(gid));
        if (!count) {
            count = -item.count;
        }
        if (count > 0) {
            fn();
        } else {
            if (btn.hasClass('count-diff')) {
                if ((item.count + count + item._change_count) > 0) {
                    fn(true);
                } else if (item.removeConfirm()) {
                    fn(true);
                }
            } else if ((btn.hasClass('delete') || btn.hasClass('deleteIcon')) && (noConfirm || item.removeConfirm())) {
                item._change_count = 0;
                fn(true);
            }



        }

        function fn(is_diff) {
            item.add({
                btn: btn,
                start: function (newCount) {
                    if (btn.hasClass('delete') || btn.hasClass('deleteIcon')) {
                        btn.addClass('disable');
                        $('.count-diff, .count-add', view).addClass('disable');
                    }
                    view.find('.count').text(newCount || '0');
                    //view.find('.cart-bar').children('span').text(Common.moneyString0(Cart._sum) || '0');
                    var content = btn.parents('.topic_list');

                    if(content.length > 0) {
                        var topic_items = topicArr[content.data('id')];
                        for(var i in topic_items.list){
                            if(view.data('id') == topic_items.list[i].itemId){
                                if (btn.hasClass('count-add') || btn.hasClass('count-diff')) {
                                    topic_items.list[i].cartCount = newCount
                                }
                                if(btn.hasClass('deleteIcon') || btn.hasClass('delete')){
                                    topic_items.list[i].cartCount = 0;
                                }
                            }
                        }

                        topicParam(topic_items,view,true);
                    }

                },
                count: count,
                view: view
            }).done(function(){

            }).always(function () {

                if (item.count > 0) {
                    view.find('.count').text(item.count).show();
                    // view.find('.cart-bar').children('span').text(Common.moneyString0(Cart._sum));
                    $('.count-diff, .count-add, .delete,.deleteIcon', view).removeClass('disable');
                } else {
                    view.on('webkitAnimationEnd', function () {

                        if(btn.parents('.topic_list').length > 0){
                            if(btn.parents('.topic_list').find('.cart-item').length == 1){
                                btn.parents('.topic_list').remove();
                            }else{
                                view.remove();
                            }
                        }else{
                            view.remove();
                        }
                    }).addClass('disappear-fast');


                    var lit_num = parseInt(btn.parents('.topic_list').find('.lit_count').children('b').text()),
                        isChecked = view.find('.checked').length;

                    if(isChecked != 0){
                        lit_num -=1;
                    }
                    btn.parents('.topic_list').find('.lit_count').children('b').text(lit_num);//小计数量

                    var list_l = parseInt($('.navbar-main span em').text()); //购物车总数量
                    list_l -=1;
                    if(list_l == 0){
                        $('.navbar-main span').hide();
                    }
                    $('.navbar-main span em').text(list_l);
                    $('#app-bar li:nth-child(3) p').text(list_l +'件');
                }

                renderSmallCart({is_del: is_del});
                renderEmptyCart(is_diff, is_del);

            }).fail(function (json) {

                alert(json && json.msg || '同步购物车失败！');
            });

        }
    }
    /*function allSelect(btn){
     $('.cart-item', Page).toggleClass('checked', btn.parent().toggleClass('checked').hasClass('checked'));
     }*/


    init();

});
